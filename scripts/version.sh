#!/usr/bin/env bash

target_base="$1"
current_tag="$(git describe --tags --exclude="*sha*" --abbrev=0 2>/dev/null)"
if [[ -z "$current_tag" ]]; then
	echo "$target_base (first)"
	exit
fi

target_version=($(echo "$target_base" | tr '.' '\n'))
current_version=($(echo "${current_tag#v}" | tr '.' '\n'))
if [[ "${current_version[0]}" != "${target_version[0]}" ]]; then
	echo "$target_base (major)"
	exit
fi

tail_sha="$(git rev-parse $current_tag)"
if [[ -n "$(git log $tail_sha..HEAD --grep='^feat:')" ]]; then
	next_minor="$((${current_version[1]} + 1))"
	echo "${current_version[0]}.$next_minor.0 (minor)"
	exit
fi

next_patch="$((${current_version[2]} + 1))"
echo "${current_version[0]}.${current_version[1]}.$next_patch (patch)"
exit
