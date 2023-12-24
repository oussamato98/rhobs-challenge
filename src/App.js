import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";

function App() {
    const { control, watch } = useForm();
    const [allBodies, setAllBodies] = useState([]); // Stocke tous les corps récupérés
    const [filteredBodies, setFilteredBodies] = useState([]); // Stocke les corps filtrés
    const [selectedBody, setSelectedBody] = useState(null);
    const [bodyDetails, setBodyDetails] = useState(null);
    const isPlanetChecked = watch("isPlanet");
    const gravityValue = watch("gravity");

    // Récupération et filtrage des corps célestes
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
                const data = await response.json();
                setAllBodies(data.bodies); // Stockez d'abord tous les corps

                // Puis, filtrez-les
                const filtered = data.bodies.filter(body => {
                    const meetsPlanetCriteria = isPlanetChecked ? body.isPlanet : true;
                    const meetsGravityCriteria = body.gravity <= gravityValue;
                    return meetsPlanetCriteria && meetsGravityCriteria;
                });

                setFilteredBodies(filtered); // Mettez à jour les corps filtrés
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchData();
    }, []);

    // Mise à jour de la liste des corps filtrés lorsque les contrôles changent
    useEffect(() => {
        const filtered = allBodies.filter(body => {
            const meetsPlanetCriteria = isPlanetChecked ? body.isPlanet : true;
            const meetsGravityCriteria = body.gravity <= gravityValue;
            return meetsPlanetCriteria && meetsGravityCriteria;
        });

        setFilteredBodies(filtered);
    }, [isPlanetChecked, gravityValue, allBodies]);

    // Récupération des détails du corps sélectionné
    useEffect(() => {
        async function fetchBodyDetails() {
            if (selectedBody) {
                try {
                    const response = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${selectedBody}`);
                    const data = await response.json();
                    setBodyDetails(data); // Met à jour les détails du corps sélectionné
                } catch (error) {
                    console.error('Error fetching body details: ', error);
                    setBodyDetails(null);
                }
            }
        }

        fetchBodyDetails();
    }, [selectedBody]);


    return (
        <div className="App">
            <h1>RHOBS Challenge</h1>

            <label>
                Is Planet
                <Controller
                    name="isPlanet"
                    control={control}
                    render={({ field }) => <input type="checkbox" {...field} />}
                />
            </label>

            <label>
                Gravity
                <Controller
                    name="gravity"
                    control={control}
                    render={({ field }) => <input type="range" {...field} />}
                />
            </label>

            <label>
                Bodies:
                <select onChange={e => setSelectedBody(e.target.value)}>
                    {filteredBodies.map(body => (
                        <option key={body.id} value={body.id}>
                            {body.name}
                        </option>
                    ))}
                </select>
            </label>

            <div>
                <h2>Info on the body</h2>
                {/* Affiche les informations du corps sélectionné ici */}
                {bodyDetails ? (
                    <div>
                        <p>Name: {bodyDetails.name}</p>
                        <p>Gravity: {bodyDetails.gravity}</p>
                        {/* Ajoutez d'autres détails que vous souhaitez afficher */}
                    </div>
                ) : (
                    <p>Select a body to see its details.</p>
                )}
            </div>
        </div>
    );



}

export default App;
