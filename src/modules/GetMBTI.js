export default function GetMBTI(data) {
    let e = 0;
    let i = 0;
    let n = 0;
    let s = 0;
    let f = 0;
    let t = 0;
    let j = 0;
    let p = 0;
    for(var k =0;k<data.length;k++){
        switch(k){
        case 0: case 1: case 2: {
            if(data[k]==='a'){
            e++;
            }else{
            i++;
            }
            break;
        }
        case 3: case 4 : case 5 : {
            if(data[k]==='a'){
            n++;
            }else{
            s++;
            }
            break;
        }
        case 6 : case 7: case 8: {
            if(data[k]==='a'){
            f++;
            }else{
            t++;
            }
            break;
        }
        case 9: case 10: case 11: {
            if(data[k]==='a'){
            j++;
            }else{
            p++;
            }
            break;
        }
        default: break;
        }
    }
    
    var result ="";
    if(i>e){
        result+="i";
    }else{
        result+="e";
    }
    if(n>s){
        result+="n";
    }else{
        result+="s";
    }
    if(f>t){
        result+="f";
    }else{
        result+="t";
    }
    if(j>p){
        result+="j";
    }else{
        result+="p";
    }
    return result;
}

