import React, { useEffect, useState, useMemo } from 'react'
import TinderCard from 'react-tinder-card'
import axios from 'axios'
import Chat from '../components/Chat'
import { useCookies } from 'react-cookie'
import Typewriter from 'typewriter-effect';
import { useNavigate  } from 'react-router-dom';

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

  const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)

  const user_id = cookies.UserId

  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, { params: { user_id } })
      setUser(response.data)
    }
    catch (err) {
      navigate('/error'); 
    }
  }

  const getDogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, { params: { user_id } })
      setDogsList(response.data)
    }
    catch (err) {
      navigate('/error'); 
    }
  }

  const getDogsApiInfo = async () => {
    try {
      axios.defaults.headers.common['x-api-key'] = dogApiKey
      const response = await axios.get(`https://api.thedogapi.com/v1/breeds`)
      setDogsBreedList(response.data)
    }
    catch (err) { 
      navigate('/error'); 
    }
  }

  useEffect(() => {
    getUser().then(() => getDogs()).then(() => getDogsApiInfo())
  }, [])

  const breedFound = useMemo(() => dogsBreedList.find(e => e.name === breedName), [breedName])

  const addMatch = async (swipedUserId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/addMatch`, {
        user_id,
        swipedUserId
      })
      getUser()
    } catch (err) {
      navigate('/error'); 
    }
  }


  const addNoMatch = async (swipedUserId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/addNoMatch`, {
        user_id,
        swipedUserId
      })
      getUser()
    } catch (err) {
      navigate('/error'); 
    }
  }


  const swiped = (direction, swipedUserId) => {
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
          return obj.user_id !== swipedUserId;
        }))
    }
    setLastDirection(direction)
  }

  const rightClick = (right, swipedUserId) => {
    addMatch(swipedUserId)
    setBreedName('')
    setClassAnim('')
    setDogsList(current =>
      current.filter(obj => {
        return obj.user_id !== swipedUserId;
      }))
    setLastDirection(right)
  }

  const leftClick = (left, swipedUserId) => {
    addNoMatch(swipedUserId)
    setBreedName('')
    setClassAnim('')
    setDogsList(current =>
      current.filter(obj => {
        return obj.user_id !== swipedUserId;
      }))
    setLastDirection(left)
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
                <div className="zIndex2" key={character.name}>
                  {userMatchesArray.length === dogsList.length &&
                    <h2 className='endList'>No one left, come back later ...</h2>}
                  {
                    userMatchesArray && !userMatchesArray.includes(character.user_id) &&
                    character.user_id &&
                    <>
                      <TinderCard
                        className='swipe'
                        onSwipe={(right) => swiped(right, character.user_id)}
                        onCardLeftScreen={() => outOfFrame(character.name)}
                        preventSwipe={['right', 'left']}
                        >
                        <div
                          style={{ backgroundImage: 'url(' + character.url + ')' }}
                          className='card'>
                          <div className='nameContainer'>
                              <h3 className= {character.gender === "female" ? 'name female' : 'name male'}>{character.name}</h3>
                          </div>
                          <div className='buttonValidateContainer'>
                            <button
                              onClick={(left) => leftClick(left, character.user_id)}
                              className="unvalidate"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z" /></svg></button>
                            <button
                              onClick={(right) => rightClick(right, character.user_id)}
                              className="validate"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" /></svg></button>
                          </div>
                          <div className='desc'>
                            <div>
                              <p>Gender : {character.gender}</p>
                              <p>Age : {getAge(character.dob) > 0 ? getAge(character.dob) + " years old" : "Less than a year !"}</p>
                              <p>Race : {character.race}</p>
                              <p>Hobby : {character.about}</p>
                            </div>
                          </div>
                          <button className={breedFound ? "hidden" : "buttonModal"} onClick={() => setBreedAndAnim(character.race)} >More about the {character.race}</button>
                        </div>
                      </TinderCard>
                    </>
                  }
                </div>
              )}
            {dogsList.length == 0 &&
              <h2 className='endList'>No one left, come back later ...</h2>}
          </div>
          <div className={`dogsApi ${classAnim}`}>
            {breedFound &&
              <div className='dogsApiContainer'>
                <h3>The {breedFound.name}</h3>
                <div>
                  <Typewriter
                    options={{
                      delay: 45,
                    }}
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(`He is good at ${breedFound.bred_for.toLowerCase()},<br><br>`)
                        .typeString(`He is ${breedFound.temperament.toLowerCase()},<br><br>`)
                        .typeString(`He belongs to the ${breedFound.breed_group.toLowerCase()} groups,<br><br>`)
                        .typeString(`He measures about ${breedFound.height.metric} cm,<br><br>`)
                        .typeString(`He can weigh ${breedFound.weight.metric} kg,<br><br>`)
                        .typeString(`He lives around ${breedFound.life_span}.<br><br>`)
                        .typeString(`<img className='imgBreed' width="200" src=${breedFound.image.url} alt=${breedFound.name}></img>`)
                        .start();
                    }}
                  />
                </div>
              </div>
            }
          </div>
        </div >
      }
    </>
  )
}
export default Dashboard;
