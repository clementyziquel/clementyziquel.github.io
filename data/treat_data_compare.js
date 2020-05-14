let donnees2 = [];
function parser_compare() {
  var inf = document.getElementById("fileInput2");
  Papa.parse(fileInput2.files[0],{
      delimiter: ",",
      linebreak: "\n",
      newline: "\n",
      header: true,
      download: false,
      comments: "####",
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results, file) {
        console.log(results, file);
        document.getElementById("parse_status").innerHTML = "Affichage des données";
        document.getElementById("parse_advise").innerHTML = "Conseil d'utilisation: Vous pouvez zoomer sur les graphiques ainsi que les télécharger.(<sup>1</sup>)";
        document.getElementById("note").innerHTML = "(<sup>1</sup>):Les données présentées ont été modifiées pour une meilleure lisibilité, chaque point correspond à la moyenne de la journée en question et des 6 jours suivant";

        ville = file.name; //Je récupère le nom de la ville.csv
        ville=name_modif(ville);

        donnees2 = results.data;
        nbdonnees=((donnees2.length)-(donnees2.length)%7); //Je retire le nombre de valeurs necessaire pour atteindre un multiple de 7

        xvals = donnees2.map(el => new Date(el.DATE));
        let xval =[];
        for(j=0,i=0;j<nbdonnees;j=j+7,i++){ //J'avance de 7 en 7
          xval[i]=xvals[j]; //Je ne récupère que un jour sur 7 dans xval[i]
        }

        let yvals = donnees2.map(el => el.PRECIP_TOTAL_DAY_MM);
        for(j=0,i=0;j<nbdonnees;j=j+7,i++){ //J'avance de 7 en 7
          compteur=0;
          for(k=0;k<7;k++){
            compteur = compteur + donnees2[j+k].PRECIP_TOTAL_DAY_MM; //J'additionne les données de 7 jours qui se suivent
          }
          yvals[i]=compteur/7; //Je divise par 7 pour avoir la moyenne des précipitations sur 7 jours
        }

        let yvals2 = [];
        for(j=0,i=0;j<nbdonnees;j=j+7,i++){ //J'avance de 7 en 7
          compteur=0;
          for(k=0;k<7;k++){
            compteur = compteur + donnees2[j+k].MIN_TEMPERATURE_C; //J'additionne les données de 7 jours qui se suivent
          }
          yvals2[i]=compteur/7;  //Je divise par 7 pour avoir la moyenne de la T°C sur 7 jours
        }

        let yvals3 = [];
        for(j=0,i=0;j<nbdonnees;j=j+7,i++){ //J'avance de 7 en 7
          compteur=0;
          for(k=0;k<7;k++){
            compteur = compteur + donnees2[j+k].MAX_TEMPERATURE_C; //J'additionne les données de 7 jours qui se suivent
          }
          yvals3[i]=compteur/7; //Je divise par 7 pour avoir la moyenne de la T°C sur 7 jours
        }

        //Calcule de la droite de regression linéaire Temp_min
        somme=0;
        nombre=0;
        for(i=0;i<donnees2.length;i++){
          somme=somme+donnees2[i].MIN_TEMPERATURE_C;
          nombre=nombre+i;
        }
        moyenneT=somme/donnees2.length;
        moyenneX=nombre/donnees2.length;

        Sxy=0
        for(i=0;i<donnees2.length;i++){
          Sxy=Sxy+(( donnees2[i].MIN_TEMPERATURE_C - moyenneT)*(i-moyenneX));
        }
        Sxy=(Sxy)/(donnees2.length-1);

        S2x=0
        for(i=0;i<donnees2.length;i++){
          S2x=S2x+((i-moyenneX)*(i-moyenneX));
        }
        S2x=(S2x)/(donnees2.length-1);

        aMin=(Sxy)/(S2x);
        bMin=moyenneT-aMin*moyenneX;
        //J'arrondis les valeurs
        aMin=Math.round(aMin*100000)/100000;
        bMin=Math.round(bMin*1000)/1000;
        plot(xval,yvals2,"Minimum de température à "+ville,"°C","pos_plot4","line",aMin,bMin,xvals,donnees2);//Appel de la fonction plot pour créer un graph

        previsions(aMin,bMin,ville,4,"la température minimale","°C");//Appel de la fonction prévision 
        //Calcule de la droite de regression linéaire Temp_max
        somme=0;
        for(i=0;i<donnees2.length;i++){
          somme=somme+donnees2[i].MAX_TEMPERATURE_C;
        }
        moyenneT=somme/donnees2.length;

        Sxy=0;
        for(i=0;i<donnees2.length;i++){
          Sxy=Sxy+(( donnees2[i].MAX_TEMPERATURE_C - moyenneT)*(i-moyenneX));
        }
        Sxy=(Sxy)/(donnees2.length-1);

        S2x=0;
        for(i=0;i<donnees2.length;i++){
          S2x=S2x+((i-moyenneX)*(i-moyenneX));
        }
        S2x=(S2x)/(donnees2.length-1);

        aMax=(Sxy)/(S2x);
        bMax=moyenneT-aMax*moyenneX;
        //J'arrondis les valeurs
        aMax=Math.round(aMax*100000)/100000;
        bMax=Math.round(bMax*1000)/1000;
        plot(xval,yvals3,"Maximum de température à "+ville,"°C","pos_plot5","line",aMax,bMax,xvals,donnees2);//Appel de la fonction plot pour créer un graph


        previsions(aMax,bMax,ville,5,"la température maximale","°C");//Appel de la fonction prévision 
        affiche_analyse_temp(aMin,aMax,2);//Appel de la fonction affiche_analyse_precip pour afficher les analyses de la regression linéaire pout Temp_min et Temp_max
        document.getElementById("coeff3").innerHTML = "L'équation de la droite de tendance est y="+aMin+" x +"+bMin+" pour la température minimale et y="+aMax+" x +"+bMax+" pour la température maximale.";//Affichage de l'équation des droites de régression linéaire
        //Calcule de la droite de regression linéaire Precip
        somme=0;
        for(i=0;i<donnees2.length;i++){
          somme=somme+donnees2[i].PRECIP_TOTAL_DAY_MM;
        }
        moyenneP=somme/donnees2.length;

        Sxy=0
        for(i=0;i<donnees2.length;i++){
          Sxy=Sxy+(( donnees2[i].PRECIP_TOTAL_DAY_MM - moyenneP)*(i-moyenneX));
        }
        Sxy=(Sxy)/(donnees2.length-1);

        S2x=0;
        for(i=0;i<donnees2.length;i++){
          S2x=S2x+((i-moyenneX)*(i-moyenneX));
        }
        S2x=(S2x)/(donnees2.length-1);

        a=(Sxy)/(S2x);
        b=moyenneP-a*moyenneX;
        //J'arrondis les valeurs
        a=Math.round(a*100000)/100000;
        b=Math.round(b*1000)/1000;
        plot(xval,yvals,"Précipitations à "+ville,"mm","pos_plot6","area",a,b,xvals,donnees2);//Appel de la fonction plot pour créer un graph

        
        previsions(a,b,ville,6,"la quantité de précipitation","mm");//Appel de la fonction prévision 
        document.getElementById("coeff4").innerHTML = "L'équation de la droite de tendance est y="+a+" x +"+b+".";//Affichage de l'équation de la droite de régression linéaire
        affiche_analyse_precip(a,2);//Appel de la fonction affiche_analyse_precip pour afficher l'analyse de la régression linéaire pour la précipitation
      }
    }
  )
}