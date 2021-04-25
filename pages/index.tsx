import Link from 'next/link'
import {MainLayout} from '../components/MainLayout'
import styled from "styled-components"
import Checkbox from "../components/common/Checkbox"
import { useEffect, useRef, useState } from 'react'
import { IMeteor } from '../interafces/commonInterfaces'
import { API } from '../api/api'
import Asteroid from "../components/Asteroid"
import { LoaderIcon } from "../styles/svgIcons/loaderIcon"
import { NextPageContext } from 'next'


interface MeteorsPageProps {
  meteors: {
    links : {
      next : string
    }
    near_earth_objects: IMeteor[]
  } | null
}

export default function Index({ meteors: serverMeteors }: MeteorsPageProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [currentLink, setCurrentLink] = useState<string>(serverMeteors ? serverMeteors.links.next : process.env.API_URL)
  const [meteors, setMeteors] = useState<IMeteor[]>(serverMeteors ? serverMeteors.near_earth_objects : [])
  const [endLoading, setEndLoading] = useState<boolean>(false)

  const wrapperRef = useRef<HTMLTableElement>(null);

  const [distanceKm, setDistanceKm] = useState<boolean>(true)
  const [onlyDanger, setOnlyDanger] = useState<boolean>(false)

  
  useEffect(() => {
    if (!serverMeteors) {
      addMeteors();
    }
  }, [])

  useEffect(() => {
      document.addEventListener('scroll', onScroll)
      return () => document.removeEventListener('scroll', onScroll)
  })

  const addMeteors = async () => {
      try{
          setLoading(true)
          const response = await API.get(currentLink)
          if(response.data.page.number - 1 === response.data.page.total_pages) {
              setEndLoading(true)
          }
          setCurrentLink(response.data.links.next)
          setMeteors([...meteors, ...response.data.near_earth_objects])
      } catch (err) {
          console.log(err)
      } finally {
          setLoading(false)
      }
  }

  const onScroll = () => {
      if(!endLoading && !loading && wrapperRef.current!.getBoundingClientRect().height - window.scrollY < window.innerHeight) {
          addMeteors()
      }
  }
  
  return (
    <MainLayout title={'Home Page'}>
        <Container ref={wrapperRef}>
            <Filter>
                <Checkbox 
                    value={onlyDanger} 
                    onClick={() => setOnlyDanger(!onlyDanger)} 
                    label={"Показать только опасные"}
                />
                <Text>
                    Расстояние &nbsp;
                    <A active={distanceKm} onClick={() => setDistanceKm(true)}>
                        в километрах
                    </A>, &nbsp;
                    <A active={!distanceKm} onClick={() => setDistanceKm(false)}>
                        в дистанциях от луны
                    </A>
                </Text>
            </Filter>
            {meteors.map((meteor) => {
                if(onlyDanger && meteor.estimated_diameter.meters.estimated_diameter_min < 1000){
                    return <></>
                } else {
                    return <Asteroid 
                                key={meteor.id}
                                id={meteor.id}
                                name={meteor.name}
                                diameter={meteor.estimated_diameter.meters.estimated_diameter_min}
                                close_approach_data={meteor.close_approach_data}
                                distanceKm={distanceKm}
                                meteor={meteor}/>
                }
            })}
            {loading && <LoaderIcon width={"50px"} height={"50px"} />}
        </Container>
    </MainLayout>
  )
}

Index.getInitialProps = async ({req}: NextPageContext) => {
  if (!req) {
    return {meteors: null}
  }

  const response = await API.get(process.env.API_URL)
  const meteors: IMeteor[] = response.data

  return {
    meteors
  }
}


const Container = styled.div`
    padding-top: 26px;
    text-align: center;
`

const Filter = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    @media (max-width: 650px) {
        flex-direction: column;
        align-items: start;
        margin-bottom: 0px;
    }
`

const Text = styled.div`
    font-size: 16px;
    line-height: 20px;
    margin-top: 3px;
    @media (max-width: 650px) {
        margin-top: 16px;
    }
`

const A = styled.a<{marginRight?:number, active?: boolean}>`
    ${({active}) => active ? 'font-family: HelveticaBold' : ''};
    font-size: 16px;
    font-weight: ${({active}) => active ? 'bold' : 'normal'};
    line-height: 20px;
    margin-right: ${({marginRight}) => marginRight || 0}px;
    cursor:pointer;

    &:hover {
        text-decoration: ${({active}) => active ? 'none' : 'underline'};
        color: #000000;
    }
`
