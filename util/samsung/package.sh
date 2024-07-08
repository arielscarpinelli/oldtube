#!/bin/bash

cd ../..

npm run prepare

mkdir dist

cd dist

rm widget.zip
rm widgetlist.xml
rm index.html
mkdir img
cp ../resources/logo_*.png img/

IP=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p' | head -1)

if [ "$1" == "deploy" ]; then
	sed -e 's/dist\//http:\/\/oldtube.is-local.org\/app\//g' ../index.html > index.html
else
	sed -e "s/dist\//http:\/\/$IP\/dist\//g" ../index.html > index.html
fi

zip widget.zip index.html ../widget.info ../config.xml img/*

FILESIZE=$(stat -f%z "widget.zip")

cd ..

if [ "$1" == "deploy" ]; then
  if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "To deploy run ./package.sh deploy <server domain name> <user> <path>"
    exit 1
  fi
  IP=$(host $2 | awk '/has address/ { print $4 }')
fi

sed -e "s/FILESIZE/$FILESIZE/g; s/IP/$IP/g" widgetlist.xml.tmpl > dist/widgetlist.xml

cd dist
if [ "$1" == "deploy" ]; then
  echo "Deploying"
  scp widgetlist.xml $3@$IP:$4/
  scp widget.zip $3@$IP:$4/
  echo "Remember to deploy the js and css file by committing"
else
  echo "Listen in $IP"
  sudo python -m SimpleHTTPServer 80
fi

