export const setLoading = (bool) => {
    if(bool){
        document.querySelector(".loading").style.display = "block";
    }else{
        document.querySelector(".loading").style.display = "none";
    }
}