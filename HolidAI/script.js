const res = await fetch("../vars.json")
const {url_tappe, pexels} = await res.json()

import {setLoading} from "./cards"

const createCardsFromArray = async (destinations , selector) => {
    const result_area = document.querySelector(selector)
    result_area.innerHTML = ""
    const favorites = await getDestination()
    for(let i = 0; i < destinations.length; i++){
        const resImg = await fetch(
            "https://api.pexels.com/v1/search?query=" +
            destinations[i].title,
            {
                headers:{
                    Authorization: pexels,
                },
            }
        )
        let image = ""
        const images = await resImg.json()
        image = images.photos[0]?.src?.medium

        const card = document.createElement("div")
        card.classList.add("card")
        card.id = destinations[i].title.replaceAll(" ", "_")

        const img = document.createElement("img")
        img.src = image || "http://placehold.it/300"
        img.alt = destinations[i].title
        card.appendChild(img)

        const card_body = document.createElement("div")
        card_body.classList.add("card_body")
        card.appendChild(img)

        const h3 = document.createElement("h3")
        h3.innerText = destinations[i].title
        card_body.appendChild(h3)

        const card_description = document.createElement("div")
        card_description.classList.add("card_description")
        card_description.innerText = destinations[i].card_description
        card_body.appendChild(card_description)

        const h4Orario = document.createElement("h4")
        h4Orario.innerText =  `⏰ ${destinations[i].date}`
        card_body.appendChild(h4Orario)

        const h4Costo = document.createElement("h4")
        h4Costo.innerText = `💸 ${destinations[i].cost}`
        card_body.appendChild(h4Costo)

        const button = document.createElement("button")
        const fav = favorites.find(
            (favorite) => favorite.title === destinations[i].title
        )
        if(fav){
            button.innerText = "Rimuovi dai preferiti"
            button.addEventListener("click", async () => {
                await deleteFromFavorites(destinations[i].id)
                await createFavoritesCard()
            })
        }else{
            button.innerText = "Agguingi ai preferiti"
            button.addEventListener("click", async () => {
                await addToFavorites(destinations[i])
                await createFavoritesCard()
            })
        }
        card_body.appendChild(button)
        result_area.appendChild(card)
    }
    setLoading(false)
}

const addToFavorites = async(destination) => {
    const url = "http://localhost:3001/destinations"
    const res = await fetch(url , {
        method: "POST",
        body: JSON.stringify(destination),
        headers: {
            "Content-Type": "applciation/json",
        },
    })
    if(res.ok){
        alert("Destinazione aggiunta con successo")
    }
}

const deleteFromFavorites = async(id) => {
    const res = await fetch("http://localhost:3001/destinations/" + id,{
        method: "DELETE",
    })
    if(res.ok){
        alert("Tappa eliminata con successo")
    }
}

const getDestinations = async() => {
    setLoading(true)
    const res = await fetch("http://localhost:3001/destinations")
    const destinations = await res.json()

    return destinations
}

const createFavoritesCard = async() => {
    const destinations = await getDestinations()
    await createCardsFromArray(destinations, ".favorites_area")
}

const submitForm = async(event)  => {
    event.preventDefault()
    setLoading(true)
    //Richiesta http
    const body = {
        destination:"",
        startDate:"",
        endDate:"",
    }

    const formChildren = event.target.children 
    for(let i = 0; i<formChildren.length; i++){
        const input = formChildren[i]
        if(input.name){
            body[input.name]
        }
    }

    const res = await fetch(url_tappe, {
        method: "POST",
        body: Json.stringify(body),
        headers:{
            "Content-Type": "application/json",
        },
    })
    const places = await res.json()
    setLoading(false)

    await createCardsFromArray(places, ".result_area")
}

document.querySelector("form").addEventListener("submit",submitForm)
await createFavoritesCard()