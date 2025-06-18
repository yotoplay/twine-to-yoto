#!/bin/bash
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "This is not a git repository!"
    exit 1
fi

git log --oneline --grep='^chore:' --invert-grep
