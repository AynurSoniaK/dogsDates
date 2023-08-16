import React, { useEffect, useState, useMemo } from 'react'
import TinderCard from 'react-tinder-card'
import axios from 'axios'
import Chat from '../components/Chat'
import ChatHeader from '../components/ChatHeader'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader"
import dogImage from '../images/chien.png';

export const Dashboard = () => {

  const [user, setUser] = useState("")
  const [dogsList, setDogsList] = useState([])
  const [cookies] = useCookies(['cookie-user'])
  const [dogsBreedList, setDogsBreedList] = useState([])
  const [dogsBreedView, setDogsBreedView] = useState(false)
  const dogApiKey = process.env.DOGAPI
  const [breedName, setBreedName] = useState("")
  const [classAnim, setClassAnim] = useState("")
  const [userMatchesArray, setUserMatchesArray] = useState([])
  //const [swipedUserInfo, setSwipedUserInfo] = useState([]);
  //const [matchText, setMatchText] = useState(false);
  const [fetchReady, setFetchReady] = useState(false)
  const [matchClickedChat, setMatchClickedChat] = useState("")
  const [closeChat, setCloseChat] = useState(false);

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  const user_id = cookies.UserId
  const navigate = useNavigate();
  const backgroundImageDog = `url(${dogImage})`;


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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, { params: { user_id } });

      const raceCount = {};

      response.data.forEach(dog => {
        const race = dog.race;
        if (race in raceCount) {
          raceCount[race] += 1;
        } else {
          raceCount[race] = 1;
        }
      });

      const updatedDogsList = response.data.map(dog => ({
        ...dog,
        count: raceCount[dog.race]
      }));

      setDogsList(updatedDogsList);
    } catch (err) {
      navigate('/error');
    }
  };

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

  const breedFound = useMemo(() => dogsBreedList.find(e => e.name === breedName), [breedName])

  const addMatch = async (swipedUserId) => {
    setDogsBreedView(false)
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
    setDogsBreedView(false)
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

  const deleteUserMatch = async (matchUserId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/deleteMatch`, {
        user_id,
        matchUserId,
      });
      getUser()
      setMatchClickedChat(false)
      setCloseChat(true)
    } catch (error) {
      console.error("Error while deleting match", error);
    }
    setTimeout(() => {
      setCloseChat(false)
    }, 6000);
  };

  const rightClick = async (dir, swipedUserId) => {
    //textMatch(swipedUserId)
    addMatch(swipedUserId)
    setBreedName('')
    setClassAnim('')
    setDogsList(current =>
      current.filter(obj => {
        return obj.user_id !== swipedUserId;
      }))
  }

  const leftClick = (left, swipedUserId) => {
    addNoMatch(swipedUserId)
    setBreedName('')
    setClassAnim('')
    setDogsList(current =>
      current.filter(obj => {
        return obj.user_id !== swipedUserId;
      }))
  }

  const setBreedAndAnim = (breed) => {
    setDogsBreedView(true)
    setBreedName(breed)
    setClassAnim("fade-in")
  }

  const numberOfSpecificRace = () => {
    const specificRace = "Labrador Retriever";
    const count = dogsList.filter(dog => dog.race === specificRace).length;
  }

  console.log(dogsList)

  useEffect(() => {
    getUser().then(() => getDogs()).then(() => getDogsApiInfo()).then(() => setFetchReady(true))
  }, [])

  useEffect(() => {
    if (user.length !== 0) {
      let tab = [];
      if (user.matches && Array.isArray(user.matches)) {
        user.matches.map(e => tab.push(e.user_id));
      }
      if (user.noMatches && Array.isArray(user.noMatches)) {
        user.noMatches.map(e => tab.push(e.user_id));
      }
      setUserMatchesArray(tab);
    }
  }, [user]);

  return (
    user ?
      <>
        <ChatHeader user={user} />
        <div className='dashboard'>
          {!fetchReady &&
            <div className="clip">
              <ClipLoader
                color="black"
                loading={user}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>}
          {fetchReady &&
            <>
              <Chat user={user} setMatchClickedChat={setMatchClickedChat} closeChat={closeChat} setCloseChat={setCloseChat} />
              {matchClickedChat ?
                <>
                  <div className="swipeContainer">
                    <div>
                      <TinderCard
                        className='swipe'
                        preventSwipe={['right', 'left']}
                      >
                        <div
                          style={{ backgroundImage: 'url(' + matchClickedChat.url + ')' }}
                          className='card'>
                          <div className='nameContainer'>
                            <div className='iconDescCloseContainer'>
                              <svg onClick={() => { setMatchClickedChat(false); setCloseChat(true); setDogsBreedView(false) }} className="iconDesc iconDescCloseProfil" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" /></svg>
                            </div>
                            <h3 className="name">{matchClickedChat.name}</h3>
                          </div>
                          {/* {matchText &&
                                            <div className='matchText'>
                                              <h3 className='gradientColor'>It's a match !</h3> :
                                            </div>
                                          } */}
                          <div className='desc'>
                            <div>
                              <h3>{matchClickedChat.name}'s info</h3>
                              <div className='rowDesc'>
                                <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M176 288a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM352 176c0 86.3-62.1 158.1-144 173.1V384h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H208v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V448H112c-17.7 0-32-14.3-32-32s14.3-32 32-32h32V349.1C62.1 334.1 0 262.3 0 176C0 78.8 78.8 0 176 0s176 78.8 176 176zM271.9 360.6c19.3-10.1 36.9-23.1 52.1-38.4c20 18.5 46.7 29.8 76.1 29.8c61.9 0 112-50.1 112-112s-50.1-112-112-112c-7.2 0-14.3 .7-21.1 2c-4.9-21.5-13-41.7-24-60.2C369.3 66 384.4 64 400 64c37 0 71.4 11.4 99.8 31l20.6-20.6L487 41c-6.9-6.9-8.9-17.2-5.2-26.2S494.3 0 504 0H616c13.3 0 24 10.7 24 24V136c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L545 140.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176c-50.5 0-96-21.3-128.1-55.4z" /></svg>
                                <p>{matchClickedChat.gender}</p>
                              </div>
                              <div className='rowDesc'>
                                <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M86.4 5.5L61.8 47.6C58 54.1 56 61.6 56 69.2V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L105.6 5.5C103.6 2.1 100 0 96 0s-7.6 2.1-9.6 5.5zm128 0L189.8 47.6c-3.8 6.5-5.8 14-5.8 21.6V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L233.6 5.5C231.6 2.1 228 0 224 0s-7.6 2.1-9.6 5.5zM317.8 47.6c-3.8 6.5-5.8 14-5.8 21.6V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L361.6 5.5C359.6 2.1 356 0 352 0s-7.6 2.1-9.6 5.5L317.8 47.6zM128 176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48c-35.3 0-64 28.7-64 64v71c8.3 5.2 18.1 9 28.8 9c13.5 0 27.2-6.1 38.4-13.4c5.4-3.5 9.9-7.1 13-9.7c1.5-1.3 2.7-2.4 3.5-3.1c.4-.4 .7-.6 .8-.8l.1-.1 0 0 0 0s0 0 0 0s0 0 0 0c3.1-3.2 7.4-4.9 11.9-4.8s8.6 2.1 11.6 5.4l0 0 0 0 .1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c3-3.5 7.4-5.4 12-5.4s9 2 12 5.4l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c2.9-3.4 7.1-5.3 11.6-5.4s8.7 1.6 11.9 4.8l0 0 0 0 0 0 .1 .1c.2 .2 .4 .4 .8 .8c.8 .7 1.9 1.8 3.5 3.1c3.1 2.6 7.5 6.2 13 9.7c11.2 7.3 24.9 13.4 38.4 13.4c10.7 0 20.5-3.9 28.8-9V288c0-35.3-28.7-64-64-64V176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48H256V176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48H128V176zM448 394.6c-8.5 3.3-18.2 5.4-28.8 5.4c-22.5 0-42.4-9.9-55.8-18.6c-4.1-2.7-7.8-5.4-10.9-7.8c-2.8 2.4-6.1 5-9.8 7.5C329.8 390 310.6 400 288 400s-41.8-10-54.6-18.9c-3.5-2.4-6.7-4.9-9.4-7.2c-2.7 2.3-5.9 4.7-9.4 7.2C201.8 390 182.6 400 160 400s-41.8-10-54.6-18.9c-3.7-2.6-7-5.2-9.8-7.5c-3.1 2.4-6.8 5.1-10.9 7.8C71.2 390.1 51.3 400 28.8 400c-10.6 0-20.3-2.2-28.8-5.4V480c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32V394.6z" /></svg>
                                <p>{new Date(matchClickedChat.dob).toLocaleDateString('fr-FR', dateOptions)}</p>
                                {/* <p>Age : {getAge(character.dob) > 0 ? getAge(character.dob) + " years old" : "Less than a year !"}</p> */}
                              </div>
                              <div className='rowDesc'>
                                <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M128 176a128 128 0 1 1 256 0 128 128 0 1 1 -256 0zM391.8 64C359.5 24.9 310.7 0 256 0S152.5 24.9 120.2 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H391.8zM296 224c0-10.6-4.1-20.2-10.9-27.4l33.6-78.3c3.5-8.1-.3-17.5-8.4-21s-17.5 .3-21 8.4L255.7 184c-22 .1-39.7 18-39.7 40c0 22.1 17.9 40 40 40s40-17.9 40-40z" /></svg>
                                <p>{matchClickedChat.weight} kg</p>
                              </div>
                              <div className='rowDesc'>
                                <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" /></svg>
                                <p>{matchClickedChat.race}</p>
                              </div>
                              <div className='rowDesc'>
                                <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 496 512"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm114.6 226.4l-113 152.7-112.7-152.7c-8.7-11.9-19.1-50.4 13.6-72 28.1-18.1 54.6-4.2 68.5 11.9 15.9 17.9 46.6 16.9 61.7 0 13.9-16.1 40.4-30 68.1-11.9 32.9 21.6 22.6 60 13.8 72z" /></svg>
                                <p>{matchClickedChat.about}</p>
                              </div>
                              <div className='rowDesc'>
                                <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
                                <p>{matchClickedChat.city}</p>
                              </div>
                              <div className='removeMatch'>
                                <button onClick={() => deleteUserMatch(matchClickedChat.user_id)}>Remove {matchClickedChat.name}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TinderCard>
                    </div>
                  </div>
                </> :
                <>
                  {dogsList.length === 0 &&
                    <div className='emptyDogListText'>
                      <h2 className='endList'>No one here</h2>
                    </div>}
                  <div className="swipeContainer">
                    {
                      dogsBreedList.length > 0 && dogsList.length > 0 &&
                      dogsList.map((character, index) =>
                        <div className="zIndex2" key={character.name}>
                          {userMatchesArray.length === dogsList.length &&
                            <h2 className='endList'>No one left</h2>}
                          {
                            userMatchesArray && !userMatchesArray.includes(character.user_id) &&
                            character.user_id &&
                            <>
                              <TinderCard
                                className='swipe'
                                preventSwipe={['right', 'left']}
                                onClick={(dir) => leftClick(dir, character.user_id)}
                              >
                                <div
                                  style={{ backgroundImage: dogsBreedView ? backgroundImageDog : 'url(' + character.url + ')' }}
                                  className='card'>
                                  <div className='nameContainer'>
                                    <h3 className="name">{dogsBreedView ? breedFound.name : character.name}</h3>
                                  </div>
                                  {/* {matchText &&
                                <div className='matchText'>
                                  <h3 className='gradientColor'>It's a match !</h3> :
                                </div>
                              } */}
                                  {!dogsBreedView ?
                                    <div className='buttonValidateContainer'>
                                      <button
                                        onClick={(dir) => leftClick(dir, character.user_id)}
                                        className="unvalidate"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z" /></svg></button>
                                      <button
                                        onClick={(dir) => rightClick(dir, character.user_id)}
                                        className="validate"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" /></svg></button>
                                    </div> :
                                    <div className='centeredContainer'>
                                    <button className='profileBack'
                                      onClick={() => setDogsBreedView(false)}
                                    >Back to {character.name}'s profile
                                    </button>
                                    </div>}
                                  <div className='desc'>
                                    {!dogsBreedView ?
                                      <div>
                                        <div className='centeredContainer'>
                                          <button className={dogsBreedView ? "hidden" : "buttonModal"} onClick={() => setBreedAndAnim(character.race)} >More about the {character.race}</button>
                                        </div>
                                        <h3>{character.name}'s info</h3>
                                        <div className='rowDesc'>
                                          <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M176 288a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM352 176c0 86.3-62.1 158.1-144 173.1V384h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H208v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V448H112c-17.7 0-32-14.3-32-32s14.3-32 32-32h32V349.1C62.1 334.1 0 262.3 0 176C0 78.8 78.8 0 176 0s176 78.8 176 176zM271.9 360.6c19.3-10.1 36.9-23.1 52.1-38.4c20 18.5 46.7 29.8 76.1 29.8c61.9 0 112-50.1 112-112s-50.1-112-112-112c-7.2 0-14.3 .7-21.1 2c-4.9-21.5-13-41.7-24-60.2C369.3 66 384.4 64 400 64c37 0 71.4 11.4 99.8 31l20.6-20.6L487 41c-6.9-6.9-8.9-17.2-5.2-26.2S494.3 0 504 0H616c13.3 0 24 10.7 24 24V136c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L545 140.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176c-50.5 0-96-21.3-128.1-55.4z" /></svg>
                                          <p>{character.gender}</p>
                                        </div>
                                        <div className='rowDesc'>
                                          <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M86.4 5.5L61.8 47.6C58 54.1 56 61.6 56 69.2V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L105.6 5.5C103.6 2.1 100 0 96 0s-7.6 2.1-9.6 5.5zm128 0L189.8 47.6c-3.8 6.5-5.8 14-5.8 21.6V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L233.6 5.5C231.6 2.1 228 0 224 0s-7.6 2.1-9.6 5.5zM317.8 47.6c-3.8 6.5-5.8 14-5.8 21.6V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L361.6 5.5C359.6 2.1 356 0 352 0s-7.6 2.1-9.6 5.5L317.8 47.6zM128 176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48c-35.3 0-64 28.7-64 64v71c8.3 5.2 18.1 9 28.8 9c13.5 0 27.2-6.1 38.4-13.4c5.4-3.5 9.9-7.1 13-9.7c1.5-1.3 2.7-2.4 3.5-3.1c.4-.4 .7-.6 .8-.8l.1-.1 0 0 0 0s0 0 0 0s0 0 0 0c3.1-3.2 7.4-4.9 11.9-4.8s8.6 2.1 11.6 5.4l0 0 0 0 .1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c3-3.5 7.4-5.4 12-5.4s9 2 12 5.4l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c2.9-3.4 7.1-5.3 11.6-5.4s8.7 1.6 11.9 4.8l0 0 0 0 0 0 .1 .1c.2 .2 .4 .4 .8 .8c.8 .7 1.9 1.8 3.5 3.1c3.1 2.6 7.5 6.2 13 9.7c11.2 7.3 24.9 13.4 38.4 13.4c10.7 0 20.5-3.9 28.8-9V288c0-35.3-28.7-64-64-64V176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48H256V176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48H128V176zM448 394.6c-8.5 3.3-18.2 5.4-28.8 5.4c-22.5 0-42.4-9.9-55.8-18.6c-4.1-2.7-7.8-5.4-10.9-7.8c-2.8 2.4-6.1 5-9.8 7.5C329.8 390 310.6 400 288 400s-41.8-10-54.6-18.9c-3.5-2.4-6.7-4.9-9.4-7.2c-2.7 2.3-5.9 4.7-9.4 7.2C201.8 390 182.6 400 160 400s-41.8-10-54.6-18.9c-3.7-2.6-7-5.2-9.8-7.5c-3.1 2.4-6.8 5.1-10.9 7.8C71.2 390.1 51.3 400 28.8 400c-10.6 0-20.3-2.2-28.8-5.4V480c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32V394.6z" /></svg>
                                          <p>{new Date(character.dob).toLocaleDateString('fr-FR', dateOptions)}</p>
                                          {/* <p>Age : {getAge(character.dob) > 0 ? getAge(character.dob) + " years old" : "Less than a year !"}</p> */}
                                        </div>
                                        <div className='rowDesc'>
                                          <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M128 176a128 128 0 1 1 256 0 128 128 0 1 1 -256 0zM391.8 64C359.5 24.9 310.7 0 256 0S152.5 24.9 120.2 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H391.8zM296 224c0-10.6-4.1-20.2-10.9-27.4l33.6-78.3c3.5-8.1-.3-17.5-8.4-21s-17.5 .3-21 8.4L255.7 184c-22 .1-39.7 18-39.7 40c0 22.1 17.9 40 40 40s40-17.9 40-40z" /></svg>
                                          <p>{character.weight} kg</p>
                                        </div>
                                        <div className='rowDesc'>
                                          <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" /></svg>
                                          <p>{character.race}</p>
                                        </div>
                                        <div className='rowDesc'>
                                          <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 496 512"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm114.6 226.4l-113 152.7-112.7-152.7c-8.7-11.9-19.1-50.4 13.6-72 28.1-18.1 54.6-4.2 68.5 11.9 15.9 17.9 46.6 16.9 61.7 0 13.9-16.1 40.4-30 68.1-11.9 32.9 21.6 22.6 60 13.8 72z" /></svg>
                                          <p>{character.about}</p>
                                        </div>
                                        <div className='rowDesc'>
                                          <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
                                          <p>{character.city}</p>
                                        </div>
                                        <div className='countRace'>
                                          <p>Number of {character.race} on DogsDates : {character.count}</p>
                                        </div>
                                      </div>
                                      :
                                      <div className={`dogsApi ${classAnim}`}>
                                        {dogsBreedView && breedFound &&
                                          <div>
                                            <div className='iconDescCloseContainer'>
                                              <svg onClick={() => { setDogsBreedView(false) }} className="iconDesc iconDescClose" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" /></svg>
                                            </div>
                                            <h3>The race info</h3>
                                            <div className='rowDesc'>
                                              <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
                                              <p>{breedFound.bred_for?.toLowerCase()}
                                              </p>
                                            </div>
                                            <div className='rowDesc'>
                                              <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" /></svg>
                                              <p>{breedFound.breed_group} groups</p>
                                            </div>
                                            <div className='rowDesc'>
                                              <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M.2 468.9C2.7 493.1 23.1 512 48 512l96 0 320 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-48c0-26.5-21.5-48-48-48L48 0C21.5 0 0 21.5 0 48L0 368l0 96c0 1.7 .1 3.3 .2 4.9z" /></svg>
                                              <p>{breedFound.height.metric} cm</p>
                                            </div>
                                            <div className='rowDesc'>
                                              <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M128 176a128 128 0 1 1 256 0 128 128 0 1 1 -256 0zM391.8 64C359.5 24.9 310.7 0 256 0S152.5 24.9 120.2 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H391.8zM296 224c0-10.6-4.1-20.2-10.9-27.4l33.6-78.3c3.5-8.1-.3-17.5-8.4-21s-17.5 .3-21 8.4L255.7 184c-22 .1-39.7 18-39.7 40c0 22.1 17.9 40 40 40s40-17.9 40-40z" /></svg>
                                              <p>{breedFound.weight.metric} kg</p>
                                            </div>
                                            <div className='rowDesc'>
                                              <svg className="iconDesc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4h87c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31H476.3c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240h-132c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9H16c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1v5.8c0 16.9-2.8 33.5-8.3 49.1z" /></svg>
                                              <p>{breedFound.life_span}</p></div>
                                            <div className="badge-container">
                                              {breedFound.temperament?.split(", ").map((adjective, index) => (
                                                <span key={index} className="badge">
                                                  {adjective}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        }
                                      </div>
                                    }
                                  </div>
                                </div>
                              </TinderCard>
                            </>
                          }
                        </div>
                      )}
                  </div>
                </>
              }
            </>
          }
        </div >
      </>
      :
      <>
      </>
  )
}
export default Dashboard;
