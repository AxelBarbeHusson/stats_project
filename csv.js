////////////////////////////////////
/* *** Parser un texte en csv *** */
function csvParserTexte(jscsv_texte,jscsv_sep,jscsv_dlm,jscsv_com, jscsv_brr, jscsv_str, jscsv_dbg)
{
    /* *** Script écrit par NVRB *** */
    /*
       SYNTAXE:
                csvParserTexte(texte [, separateur, delimiteur, commentaire, bourrage, stricte, debug]);

       DESCRIPTION:
                Parse un texte en CSV et retourne le contenu sous forme d'un tableau.
                Retourne FALSE en cas de problème sous si debug est à TRUE, alors la fonction retourne un réel correspondant à la ligne où est survenu le défaut.

       RETOUR:
                [BOOLEEN] FALSE en cas d'erreur de lecture
                [ARRAY] un tableau bidimensionnel des valeurs en cas de succès
                [REEL] si debug est TRUE et qu'il y a une erreur, retourne le numéro de la ligne erroné, 0 si c'est un problème sur les arguments.

       ARGUMENTS:
                [CHAINE] texte: texte à parser en csv
                [CHAINE] separateur (facultatif): caractere separateur des cellules du tableau csv (par défaut, le point-virgule).
                [CHAINE] delimiteur (facultatif): caractere delimitant les zones de texte (par défaut le ").
                [CHAINE] commentaire (facultatif): caractere designant une ligne de commentaire qui doit être ignorée (par défaut #).
                [BOOLEEN] bourrage (facultatif): si TRUE, des cellules vides seront ajouter au tableau en fin de ligne afin que le tableau possède un nombre de colonne identique à chaque ligne (par défaut TRUE).
                [BOOLEEN] stricte (facultatif): si FALSE, les erreurs du documents sont ignorées mais le résultat peut être inattendu (par défaut TRUE).
                [BOOLEEN] debug (facultatif): si TRUE et stricte à TRUE, en cas d'erreur, au lieu de renvoyer FALSE, la fonction renvoi un réél correspond à la ligne fautive; 0 correspond à une erreur dans les arguments de la fonction (par défaut false). Utile pour le débogage.
    */

    //ini des arguments
    var jscsv_sep = (typeof jscsv_sep !== 'undefined') ? jscsv_sep : ';';
    var jscsv_dlm = (typeof jscsv_dlm !== 'undefined') ? jscsv_dlm : '"';
    var jscsv_com = (typeof jscsv_com !== 'undefined') ? jscsv_com : '#';
    var jscsv_brr = (typeof jscsv_brr !== 'undefined') ? jscsv_brr : true;
    var jscsv_str = (typeof jscsv_str !== 'undefined') ? jscsv_str : true;
    var jscsv_dbg = (typeof jscsv_dbg !== 'undefined') ? jscsv_dbg : false;
    //manque texte
    var jscsv_texte = (typeof jscsv_texte !== 'undefined') ? jscsv_texte : '';
    if (jscsv_texte == "") { if (jscsv_dbg) { return 0; } else { return false;} }
    //argument incohérent
    if ((jscsv_sep.length>1)||(jscsv_dlm.length>1)||(jscsv_com.length>1))
    { if (jscsv_dbg) { return 0; } else { return false;} }
    //gestion des retours chariots
    var jscsv_rl = String.fromCharCode(13); //caractere retour chariot
        //13-10>13
        jscsv_texte = jscsv_texte.replace(new RegExp("("+jscsv_rl+String.fromCharCode(10)+")","g"),jscsv_rl);
        //10>13
        jscsv_texte = jscsv_texte.replace(new RegExp("("+String.fromCharCode(10)+")","g"),jscsv_rl);
        //deb
        while (jscsv_texte.charAt(0)==jscsv_rl)
        { jscsv_texte = jscsv_texte.substring(1); }
        //fin
        while (jscsv_texte.charAt(jscsv_texte.length-1)==jscsv_rl)
        { jscsv_texte = jscsv_texte.substring(0,jscsv_texte.length-1); }

    //etat val de parsage
    var jscsv_esp = String.fromCharCode(32); //caractere espace
    var jscsv_tbl = String.fromCharCode(9); //caractere tabulation
    var jscsv_lignes = new Array(); //tableau de valeur total
    var jscsv_ligne = new Array(); //tableau de valeur de la ligne
    var jscsv_idx = 0; //index caractère sur le texte
    var jscsv_c = ""; //caractere de l'index
    var jscsv_c2 = ""; //caractere de l'index suivant
    var jscsv_c3 = ""; //caractere de l'index suivant+1
    var jscsv_nc = jscsv_texte.length; //taille du texte
    var jscsv_val = ""; //valeur de la cellule
    var jscsv_ztx = false; //dans zone texte délimitée
    var jscsv_i = 0; //variable d'incrementation de boucle

    //DEB:lecture c/c
    do
    {

        jscsv_c = jscsv_texte.charAt(jscsv_idx);
        jscsv_c2 = jscsv_texte.charAt(jscsv_idx+1);
        jscsv_c3 = jscsv_texte.charAt(jscsv_idx+1);

        //caractères espace/tabultion en debut de cellule et hors zone texte
        if (((jscsv_c==jscsv_esp)||(jscsv_c==jscsv_tbl))&&(jscsv_val.length==0)&&(!jscsv_ztx))
        { /* ne rien faire */ }
        //caractere delimiteur en debut de cellule et non doublé
        else if ((jscsv_c==jscsv_dlm)&&(jscsv_val.length==0)&&(jscsv_c2!=jscsv_dlm))
        { jscsv_ztx=true; }
        //caractere delimiteur en milieu de cellule non doublé et hors zone txt
        else if ((jscsv_c==jscsv_dlm)&&(jscsv_val.length>0)&&(jscsv_c2!=jscsv_dlm)&&(!jscsv_ztx))
        { jscsv_val+=jscsv_c; }
        //caractere delimiteur double
        else if ((jscsv_c==jscsv_dlm)&&(jscsv_c2==jscsv_dlm))
        {
            if (jscsv_val.length==0)
            {
                jscsv_bcl=true;
                for (jscsv_i=jscsv_idx+2;jscsv_bcl&&(jscsv_i<=jscsv_nc);jscsv_i+=1)
                {
                    switch (jscsv_texte.charAt(jscsv_i))
                    {
                        case jscsv_esp: break;
                        case jscsv_tbl: break;
                        case jscsv_rl:
                            jscsv_idx=jscsv_i-1; jscsv_bcl=false;
                            break;
                        case jscsv_sep:
                            jscsv_idx=jscsv_i-1; jscsv_bcl=false;
                            break;
                        case "":
                            jscsv_idx=jscsv_i-1; jscsv_bcl=false;
                            break;
                        case jscsv_dlm:
                            jscsv_val+=jscsv_c; jscsv_idx+=2;
                            jscsv_ztx=1-jscsv_ztx;
                            jscsv_bcl=false;
                            break;
                        default:
                            jscsv_val+=jscsv_c; jscsv_idx+=1;
                            jscsv_bcl=false;
                            break;
                    }
                }
            } else { jscsv_val+=jscsv_c; jscsv_idx+=1; }
        }
        //caractere delimiteur non double en milieu de cellule dans zone texte
        else if ((jscsv_c==jscsv_dlm)&&(jscsv_c2!=jscsv_dlm)&&(jscsv_val.length>0)&&(jscsv_ztx))
        {
            var jscsv_bcl=true;
            for (jscsv_i=jscsv_idx+1;jscsv_bcl;jscsv_i++)
            {
                switch (jscsv_texte.charAt(jscsv_i))
                {
                    case jscsv_esp: break;
                    case jscsv_tbl: break;
                    case jscsv_rl:
                        //ajout cellule
                        jscsv_ligne.push(jscsv_val); jscsv_val="";
                        jscsv_lignes.push(jscsv_ligne); jscsv_ligne=new Array();
                        jscsv_ztx=false;
                        jscsv_idx=jscsv_i;
                        jscsv_bcl=false;
                    break;
                    case "":
                        //ajout cellule
                        jscsv_ligne.push(jscsv_val); jscsv_val="";
                        jscsv_lignes.push(jscsv_ligne); jscsv_ligne=new Array();
                        jscsv_ztx=false;
                        jscsv_idx=jscsv_i;
                        jscsv_bcl=false;
                    break;
                    case jscsv_sep:
                        //ajout cellule
                        jscsv_ligne.push(jscsv_val); jscsv_val="";
                        jscsv_ztx=false;
                        jscsv_idx=jscsv_i;
                        jscsv_bcl=false;
                    break;
                    default:
                        if (jscsv_str)
                        {
                            if (jscsv_dbg)
                            {
                                return jscsv_texte.substring(0,jscsv_idx).split(new RegExp("["+jscsv_rl+"]+","g")).length;
                            }
                            else { return false; }
                        }
                        else {
                                jscsv_val+=jscsv_c;
                                jscsv_bcl=false;
                             }
                    break;
                }
            }
        }
        //caractere separateur hors zone texte
        else if ((jscsv_c==jscsv_sep)&&(!jscsv_ztx))
        {
            //ajout cellule
            jscsv_ligne.push(jscsv_val); jscsv_val="";
        }
        //caractere retour a la ligne hors zone texte
        else if ((jscsv_c==jscsv_rl)&&(!jscsv_ztx))
        {
            if ((jscsv_ligne.length!=0)||(jscsv_val.length!=0))
            {
                //ajout cellule
                jscsv_ligne.push(jscsv_val); jscsv_val="";
                jscsv_lignes.push(jscsv_ligne); jscsv_ligne=new Array();
            }
        }
        //caractere commentaire en debut de cellule et de ligne
        else if ((jscsv_c==jscsv_com)&&(jscsv_val.length==0)&&(jscsv_ligne.length==0))
        {
            jscsv_i = jscsv_texte.indexOf(jscsv_rl,jscsv_idx);
            if (jscsv_i==-1) { jscsv_idx=jscsv_nc; } else { jscsv_idx=jscsv_i; }
        }
        //fin de fichier hors zone texte
        else if (jscsv_c.length==0)
        {
            if (jscsv_ztx)
            {
                if (jscsv_str)  {
                            if (jscsv_dbg)
                            {
                                return jscsv_texte.substring(0,jscsv_idx).split(new RegExp("["+jscsv_rl+"]+","g")).length;
                            }
                            else { return false; }
                                }
                else
                {
                    //ajout cellule
                    jscsv_ligne.push(jscsv_val); jscsv_val="";
                    jscsv_lignes.push(jscsv_ligne); jscsv_ligne=new Array();
                }
            } else {
                //ajout cellule
                jscsv_ligne.push(jscsv_val); jscsv_val="";
                jscsv_lignes.push(jscsv_ligne); jscsv_ligne=new Array();
            }
        }
        //autres caracteres
        else
        {
            jscsv_val+=jscsv_c;
        }

        jscsv_idx+=1;

    } while (jscsv_idx <= jscsv_nc);
    //FIN:lecture c/c

    //DEB:bourrage
    if (jscsv_brr)
    {
        jscsv_brr=0;
        for (jscsv_i=0;jscsv_i<jscsv_lignes.length;jscsv_i++)
        {
            jscsv_brr = Math.max(jscsv_brr,jscsv_lignes[jscsv_i].length);
        }
        for (jscsv_i=0;jscsv_i<jscsv_lignes.length;jscsv_i++)
        {
            while (jscsv_lignes[jscsv_i].length < jscsv_brr)
            {
                jscsv_lignes[jscsv_i].push('');
            }
        }
    }
    //FIN:bourrage

    return jscsv_lignes;
    //--
}
