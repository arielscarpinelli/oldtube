#!/bin/bash

OUTPUT_FILE=../../../_AppName_80292_.info
VM=2014_Smart_TV_Emulator_5_1

rm -f $OUTPUT_FILE
echo "-f oldtube" >> $OUTPUT_FILE
echo "-m kEclipseDbg" >> $OUTPUT_FILE
VBoxManage startvm "$VM"
open http://localhost:8888
