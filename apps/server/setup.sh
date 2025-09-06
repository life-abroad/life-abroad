#!/bin/bash
# exit on first error
set -e

# create venv if not exists
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# activate venv
source .venv/bin/activate

# install dev deps
pip install -r requirements-dev.txt
