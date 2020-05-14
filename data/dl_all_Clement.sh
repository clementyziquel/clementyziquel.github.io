#!/bin/bash
chmod 700 data
rm -r data
mkdir data
touch correspondance.csv
echo ville,numero>>corres.csv

for ((i=5; i<7511; i++))
  do
    wget https://www.historique-meteo.net/site/export.php?ville_id="$i"
    mv export.php?ville_id="$i" aux.csv

    line1=$(grep '"*"' aux.csv)
    ville=$(echo "$line1" | cut -d '"' -f 2)
    ville=$(echo "$ville" | iconv -f utf8 -t ascii//TRANSLIT)
    ville=${ville// /_}
    ville=$(echo $ville | tr '[:upper:]' '[:lower:]')
    tail -n +4 aux.csv > data/"$ville"_"$i".csv


    #La ligne suivante permet de créer le dossier corres.csv qui contient
    #les correspndances entre le nom des villes et leur numéro
    echo $ville,$i>>correspondance.csv
    #Je mets 2 '>' pour écrire les suivant à la suite et non effacer les précédants

  done

exit 0
