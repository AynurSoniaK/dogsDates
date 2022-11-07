import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import TinderCard from 'react-tinder-card'
import Chat from '../components/Chat'
import { useCookies } from 'react-cookie'

export const Dashboard = () => {

  const [user, setUser] = useState("")
  const [dogsList, setDogsList] = useState([])
  const [lastDirection, setLastDirection] = useState("")
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-user'])
  const [dogsBreedList, setDogsBreedList] = useState([])
  const dogApiKey = process.env.DOGAPI
  const [breedName, setBreedName] = useState("")
  const [classAnim, setClassAnim] = useState("")
  const [userMatchesArray, setUserMatchesArray] = useState([])
  const [dogListReady, setDogListReady] = useState(false)

  const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)

  const user_id = cookies.UserId

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', { params: { user_id } })
      setUser(response.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  const getDogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users', { params: { user_id } })
      setDogsList(response.data)
    }
    catch (err) { console.log(err) }
  }

  const getDogsApiInfo = async () => {
    try {
      axios.defaults.headers.common['x-api-key'] = dogApiKey
      const response = await axios.get(`https://api.thedogapi.com/v1/breeds`)
      setDogsBreedList(response.data)
      setDogListReady(true)
    }
    catch (err) { console.log(err) }
  }

  useEffect(() => {
    getUser().then(() => getDogs()).then(() => getDogsApiInfo())
  }, [])


  console.log(dogsList, "dogsList")

  const breedFound = useMemo(() => dogsBreedList.find(e => e.name === breedName), [breedName])

  const addMatch = async (swipedUserId) => {
    try {
      await axios.put('http://localhost:8000/addMatch', {
        user_id,
        swipedUserId
      })
      getUser()
    } catch (err) {
      console.log(err)
    }
  }


  const addNoMatch = async (swipedUserId) => {
    try {
      await axios.put('http://localhost:8000/addNoMatch', {
        user_id,
        swipedUserId
      })
      getUser()
    } catch (err) {
      console.log(err)
    }
  }


  const swiped = (direction, swipedUserId) => {
    console.log(swipedUserId, "swipedUserId")
    if (direction === "right") {
      addMatch(swipedUserId)
      setBreedName('')
      setClassAnim('')
      setDogsList(current =>
        current.filter(obj => {
          return obj.user_id !== swipedUserId;
        }))
    }
    if (direction === "left") {
      addNoMatch(swipedUserId)
      setBreedName('')
      setClassAnim('')
      setDogsList(current =>
        current.filter(obj => {
          console.log("left")
          return obj.user_id !== swipedUserId;
        }))
    }
    setLastDirection(direction)
  }
  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  const setBreedAndAnim = (breed) => {
    setBreedName(breed)
    setClassAnim("fade-in")
  }

  useEffect(() => {
    if (user.length !== 0) {
      let tab = []
      user.matches.map(e => tab.push(e.user_id))
      user.noMatches.map(e => tab.push(e.user_id))
      setUserMatchesArray(tab)
    }
  }, [user])


  return (
    <>
      {
        user &&
        <div className='dashboard'>
          <Chat user={user} />
          <div className="swipeContainer">
            {
              dogsList.length > 0 &&
              dogsList.map((character, index) =>
                <div className="tinderCardCSS" key={character.name}>
                  {
                    userMatchesArray && !userMatchesArray.includes(character.user_id) &&
                    character.user_id &&
                    <TinderCard
                      className='swipe'
                      onSwipe={(dir) => swiped(dir, character.user_id)}
                      onCardLeftScreen={() => outOfFrame(character.name)}>
                      <div
                        style={{ backgroundImage: 'url(' + character.url + ')' }}
                        className='card'>
                        <h3 className='name'>{character.name}</h3>
                        <div className='desc'>
                          <p>{character.about}</p>
                          {character.gender === "female" ?
                            <svg width="30px" fill="pink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M304 176c0 61.9-50.1 112-112 112s-112-50.1-112-112s50.1-112 112-112s112 50.1 112 112zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1V384H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H224V349.1z" /></svg>
                            :
                            <svg width="30px" fill="blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M289.8 46.8c3.7-9 12.5-14.8 22.2-14.8H424c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L321 204.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176S0 401.2 0 304s78.8-176 176-176c37 0 71.4 11.4 99.8 31l52.6-52.6L295 73c-6.9-6.9-8.9-17.2-5.2-26.2zM400 80l0 0h0v0zM176 416c61.9 0 112-50.1 112-112s-50.1-112-112-112s-112 50.1-112 112s50.1 112 112 112z" /></svg>
                          }
                          <p>{character.race}</p>
                          <p>{getAge(character.dob) > 0 ? getAge(character.dob) + " years old" : "Less than a year !"}</p>
                        </div>
                        <button className={breedFound ? "hidden" : "buttonModal"} onClick={() => setBreedAndAnim(character.race)} >More about the {character.race}</button>
                      </div>
                    </TinderCard>
                  }
                </div>
              )} :                       :
            <h2 className='endList'>No one left, come back later ...</h2>
          </div>
          <div className={`dogsApi ${classAnim}`}>
            {breedFound &&
              <div className='dogsApiContainer'>
                <h3>The {breedFound.name}</h3>
                <div>
                  <div className='desc'>
                    <p>He is good at {breedFound.bred_for.toLowerCase()}</p>
                    <p>He is {breedFound.temperament.toLowerCase()}</p>
                    <p>He belongs to the {breedFound.breed_group.toLowerCase()} groups</p>
                    <p>He measures about {breedFound.height.metric} cm</p>
                    <p>He can weight {breedFound.weight.metric} kg</p>
                    <p>He lives around {breedFound.life_span}</p>
                    <img className='imgBreed' width="200" src={breedFound.image.url} alt={breedFound.name}></img>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </>
  )
}
export default Dashboard;
