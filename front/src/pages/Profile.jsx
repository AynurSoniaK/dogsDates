import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCookies } from 'react-cookie'
import ClipLoader from "react-spinners/ClipLoader"

const dogApiKey = process.env.DOGAPI


const Profile = () => {

    const [cookies] = useCookies(['cookie-user'])
    const user_id = cookies.UserId
    const [breedNameList, setBreedNameList] = useState([])
    const [user, setUser] = useState("")
    const [fetchReady, setFetchReady] = useState(false)
    const logged = cookies.UserId
    const [inputData, setInputData] = useState({
        user_id: cookies.UserId,
        name: "",
        dob: "",
        race: "",
        gender: "male",
        email: "",
        url: "",
        city: "",
        weight: "",
        about: "",
        matches: [],
        noMatches: []
    })

    let navigate = useNavigate()

    const getUser = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, { params: { user_id } })
            setUser(response.data)
        }
        catch (err) {
            navigate('/error');
        }
    }

    const getBreeds = async () => {
        try {
            axios.defaults.headers.common['x-api-key'] = dogApiKey
            const response = await axios.get(`https://api.thedogapi.com/v1/breeds`)
            const breedsList = response.data.map(breed => { return breed.name })
            setBreedNameList(breedsList)
        }
        catch (err) {
            navigate('/error');
        }
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
            weight: user.weight,
            about: user.about,
            city: user.city,
            matches: user.matches ?? [],
            noMatches: user.noMatches ?? []
        }))
    }, [user])

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
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/update-user`, { inputData })
            const success = response.status === 200
            if (success) {
                navigate('/dashboard')
            }
        }
        catch (err) {
            navigate('/error');
        }
    }

    const cancelRedirect = () => {
        navigate('/dashboard');
    }

    return (
        <div className='profilePage'>
            {!fetchReady &&
            <ClipLoader
                color="black"
                loading={user}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
            />}
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
                            <label>Weight</label>
                            <input
                                id="weight"
                                type="text"
                                name="weight"
                                placeholder={"Enter weight in kg"}
                                value={inputData.weight}
                                required={true}
                                onChange={handleChange}
                            />
                            <label htmlFor="race-select">Race </label>
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
                            <label>City</label>
                            <input
                                id="city"
                                type="text"
                                name="city"
                                placeholder={"Enter name of your city"}
                                value={inputData.city}
                                required={true}
                                onChange={handleChange}
                            />
                            <div className="buttonContainer">
                                <button className='secondaryButton' onClick={() => cancelRedirect()}>Annuler</button>
                                <button type="submit" className='secondaryButton'>Enregistrer</button>
                            </div>
                        </section>
                        <section>
                            <label>About me</label>
                            <input
                                id="about"
                                type="textarea"
                                name="about"
                                placeholder="What does your dog like ?"
                                value={inputData.about}
                                required={true}
                                onChange={handleChange}
                            />
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
                            {inputData.url ?
                                <div className='profilePictureContainer'>
                                    <img src={inputData.url} alt="profile" />
                                </div> :
                                <div className='emptyDiv'>
                                    <h4>Add a photo</h4>
                                </div>
                            }
                        </section>
                    </form>
                </div>
            }
        </div>
    )
}

export default Profile