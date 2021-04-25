export interface IMeteor {
    absolute_magnitude_h: number,
    close_approach_data: ICloseApproachData[],
    designation: string,
    estimated_diameter: IEstimatedDiameter,
    id: string,
    is_potentially_hazardous_asteroid: boolean,
    is_sentry_object: boolean,
    links: {
        self: string
    },
    name: string,
    name_limited: number
    nasa_jpl_url: string,
    neo_reference_id: string,
    orbital_data: IOrbitalData[]
}

export interface ICloseApproachData {
    close_approach_date: string,
    close_approach_date_full: string,
    epoch_date_close_approach: number,
    miss_distance: {
        astronomical: string,
        kilometers: string,
        lunar: string,
        miles: string
    },
    orbiting_body: string,
    relative_velocity: {
        kilometers_per_hour: string,
        kilometers_per_second: string,
        miles_per_hour: string
    }
}

interface IEstimatedDiameter {
    feet: IMinMaxDiameter,
    kilometers: IMinMaxDiameter,
    meters: IMinMaxDiameter,
    miles: IMinMaxDiameter
}

interface IMinMaxDiameter {
    estimated_diameter_max: number,
    estimated_diameter_min: number
}


interface IOrbitalData {
    aphelion_distance: string,
    ascending_node_longitude: string,
    data_arc_in_days: number,
    eccentricity: string,
    epoch_osculation: string,
    equinox: string,
    first_observation_date: string,
    inclination: string,
    jupiter_tisserand_invariant: string,
    last_observation_date: string,
    mean_anomaly: string,
    mean_motion: string,
    minimum_orbit_intersection: string,
    observations_used: number,
    orbit_determination_date: string,
    orbit_id: string,
    orbit_uncertainty: string,
    orbital_period: string,
    perihelion_argument: string,
    perihelion_distance: string,
    perihelion_time: string,
    semi_major_axis: string,
    orbit_class: IOrbitClass
}

interface IOrbitClass {
    orbit_class_description: string,
    orbit_class_range: string,
    orbit_class_type: string
}