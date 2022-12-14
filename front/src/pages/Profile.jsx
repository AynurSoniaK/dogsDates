import axios from 'axios'
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCookies } from 'react-cookie'
const dogApiKey = process.env.DOGAPI



const Profile = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-user'])
    const user_id = cookies.UserId
    const [breedNameList, setBreedNameList] = useState([])
    const [user, setUser] = useState("")
    const [fetchReady, setFetchReady] = useState(false)
    const [checkedStatus, setCheckedStatus] = useState("Male")

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', { params: { user_id } })
            setUser(response.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    const getBreeds = async () => {
        try {
            axios.defaults.headers.common['x-api-key'] = dogApiKey
            const response = await axios.get(`https://api.thedogapi.com/v1/breeds`)
            const breedsList = response.data.map(breed => { return breed.name })
            setBreedNameList(breedsList)
        }
        catch (err) { console.log(err) }
    }

    useEffect(() => {
        getUser().then(() => getBreeds().then(() => setFetchReady(true)))
    }, [])

    useEffect(() => {
        setInputData((prevState) => ({
            ...prevState,
            user_id: cookies.UserId,
            name: user.name,
            dob: user.dob,
            race: user.race,
            gender: user.gender,
            email: user.email,
            url: user.url,
            about: user.about,
            matches: [],
            noMatches: []
        }))
    }, [user])



    // const logged = true
    const logged = cookies.UserId
    const [inputData, setInputData] = useState({
        user_id: cookies.UserId,
        name: "",
        dob: "",
        race: "",
        gender: "male",
        email: "",
        url: "",
        about: "",
        matches: [],
        noMatches: []
    })

    let navigate = useNavigate()

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setInputData((prevState) => ({
            ...prevState,
            [name]: value
        })
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put('http://localhost:8000/update-user', { inputData })
            const success = response.status === 200
            if (success) {
                navigate('/dashboard')
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    console.log(inputData, "race")

    return (
        <>
            <Navbar logged={logged} />
            {fetchReady &&
                <div className='profileContainer'>
                    {user.name ?
                        <h2>{user.name?.toUpperCase()}'S PROFILE</h2>
                        :
                        <h2>Create your profile</h2>}
                    <form onSubmit={handleSubmit}>
                        <section>
                            <label>Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={inputData.name}
                                required={true}
                                onChange={handleChange}
                            // placeholder={user.name ? user.name : ""}
                            />
                            <label>Date of Birth</label>
                            <input
                                id="dob"
                                type="date"
                                name="dob"
                                placeholder={user.dob ? user.dob : ""}
                                value={inputData.dob}
                                required={true}
                                onChange={handleChange}
                            />
                            {/* <label>Race</label>
                            <input
                                id="race"
                                type="text"
                                name="race"
                                placeholder={user.race ? user.race : ""}
                                value={inputData.race}
                                required={true}
                                onChange={handleChange}
                            /> */}
                            <label for="race-select">Race </label>
                            <select name="race" id="race-select" onChange={handleChange}>
                                <option value="">--Please choose a race</option>
                                {breedNameList.map((option, index) => {
                                    return <option key={index} >
                                        {option}
                                    </option>
                                })}
                            </select>
                            <label>Gender</label>
                            <div className='inputsContainer'>
                                <input
                                    id="maleGender"
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    onChange={handleChange}
                                    checked={inputData.gender === 'male'}
                                />
                                <label htmlFor="maleGender">Male</label>
                                <input
                                    id="femaleGender"
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    onChange={handleChange}
                                    checked={inputData.gender === 'female'}
                                />
                                <label htmlFor="femaleGender">Female</label>
                            </div>
                            <label>About me</label>
                            <input
                                id="about"
                                type="textarea"
                                name="about"
                                placeholder={user.about ? user.about : "about"}
                                value={inputData.about}
                                required={true}
                                onChange={handleChange}
                            />
                            <button type="submit" className='secondaryButton'>Envoyer</button>
                        </section>
                        <section>
                            <label>Profile Picture</label>
                            <input
                                id="url"
                                type="url"
                                name="url"
                                placeholder={user.url ? user.url : "url picture"}
                                value={inputData.url}
                                required={true}
                                onChange={handleChange}
                            />
                            {inputData.url &&
                                <div className='profilePictureContainer'>
                                    <img src={inputData.url} alt="profile" />
                                </div>
                            }
                        </section>
                    </form>
                </div>
            }
        </>
    )
}

export default Profile