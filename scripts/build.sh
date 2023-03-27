#!/usr/bin/env bash

rm -rf dist
tsc
cp src/*.d.ts dist
(
	cd src;
	for f in *[^.spec][^.d].ts; do
		name=${f//.ts/};
		cp $f ../dist/global.$name.types.d.ts;
	done
)
cp src/utils.d.ts dist/utils.types.d.ts;
find dist -name '*.types.d.ts' -exec sed -i'' 's/import type .*//g' {} \;
find dist -name '*.types.d.ts' -exec sed -i'' 's/export //g' {} \;

find dist -name '*[^.types].d.ts' -exec sed -i'' 's/.*utils.d.ts.*//g' {} \;
find dist -name '*.types.d.ts' -exec sed -i'' 's/utils.d.ts/utils.types.d.ts/g' {} \;

cp package.json LICENSE README.md dist
dot-json dist/package.json scripts --delete
dot-json dist/package.json devDependencies --delete
sed -i'' 's/"src/"./g' dist/package.json

function headsha() {
	echo $(git rev-parse HEAD)
}

function tailsha() {
	local TAG=$(git tag --list | grep -v sha | awk 'BEGIN{ RS = "" ; FS = "\n" }{print $NF}' 2>/dev/null)
	if [[ -n $TAG ]]; then
		echo $(git rev-parse "$TAG^0" 2>/dev/null)
		return
	fi

	echo $(git rev-list --max-parents=0 HEAD)
}

function bumpdiff() {
	local TAIL=$1
	if [[ -z $TAIL ]]; then
		local TAIL=$(tailsha)
	fi

	local HEAD=$2
	if [[ -z $HEAD ]]; then
		local HEAD=$(headsha)
	fi

  # Get any matches for 'feat' bump (MINOR).
  local LOG_MATCH=$(git log $TAIL..$HEAD --oneline | grep -E "^(\w)* feat(:|\()")

  # If match for MINOR.
  if [[ -n $LOG_MATCH ]]; then
	  echo minor
	  return
  fi

  # Get any matches for 'fix' bump (PATCH).
  local LOG_MATCH=$(git log $TAIL..$HEAD --oneline | grep -E "^(\w)* fix(:|\()")

  if [[ -n $LOG_MATCH ]]; then
	  echo patch
	  return
  fi
}

# oTAG= env variable not-empty, then git tag with version.
oTAG=$(env | grep oTAG)
oSHA=$(env | grep oSHA)

NAME=$(dot-json package.json name)
VERSION=$(dot-json package.json version)
VERSION_MAJOR=$(echo $VERSION | awk 'BEGIN{ FS = "." }{ print $1 }')
VERSION_MIN=$VERSION_MAJOR.0.0
VERSION_MAX=$(( $VERSION_MAJOR+1 )).0.0
VERSION_PREV=$(echo $(npm info $NAME@">=$VERSION_MIN <$VERSION_MAX" version 2>/dev/null) | awk '{print $NF}' | tr -d "'")

if [[ -z $VERSION_PREV ]]; then
	VERSION_NEXT=$VERSION_MIN

	echo "[@] new: $VERSION_NEXT (>=$VERSION_MIN <$VERSION_MAX)"
	(cd dist && dot-json package.json version $VERSION_NEXT)

else
	echo "[?] npm: $VERSION_PREV (>= $VERSION_MIN | < $VERSION_MAX)"
	(cd dist && dot-json package.json version $VERSION_PREV)

	BUMP=$(bumpdiff)
	if [[ -n $BUMP ]]; then
		(cd dist && yarn version --$BUMP --no-git-tag-version 1>/dev/null)
	fi

	VERSION_NEXT=$(cd dist && dot-json package.json version)
	echo "[@] bump: $VERSION_NEXT"

	if [[ $VERSION_PREV == $VERSION_NEXT ]]; then
		echo "[!] error: version conflict, (prev) $VERSION_PREV == (next) $VERSION_NEXT"
		echo "[!] help: ensure at least 1 'fix' or 'feat' commit since last tag"
		exit 1
	fi
fi

if [[ -n $oSHA ]]; then
	echo "[>] flag: sha"
	VERSION_NEXT=$VERSION_NEXT-sha.$(git rev-parse --short HEAD)
	(cd dist && dot-json package.json version $VERSION_NEXT)
	echo "[@] sha: $VERSION_NEXT"
fi

# Tag repo with vVERSION tag on commit.
if [[ -n $oTAG ]]; then
	echo "[>] flag: tag"
	git tag v$VERSION_NEXT
	echo "[@] tag: v$VERSION_NEXT"
fi
