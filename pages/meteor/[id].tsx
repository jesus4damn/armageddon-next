import Link from 'next/link'
import {MainLayout} from '../../components/MainLayout'
import styled from "styled-components"
import { useRouter } from 'next/router'
import { API } from '../../api/api'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/reducers/rootReducer'
import { ICloseApproachData, IMeteor } from '../../interafces/commonInterfaces'
import { addMeteorToDestroy, removeMeteorFromDestroy } from '../../store/actions/destroyActions'
import { dates } from '../../constants'
import { LoaderIcon } from "../../styles/svgIcons/loaderIcon"
import Button from "../../components/common/Button"
import { NextPageContext } from 'next'

interface MeteorPageProps {
    meteor: IMeteor
  }

export default function Meteor({ meteor: serverMeteor }: MeteorPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [meteorData, setMeteorData] = useState<IMeteor | null>(serverMeteor ? serverMeteor : null)
    const [closeApproachData, setCloseApproachData] = useState<ICloseApproachData | null>(null)
    const [toDestroy, setToDestroy] = useState<boolean>(false)
    const [error, setError] = useState(false)

    const listDestroyMeteors = useSelector((state: RootState) => state.destroy.list)

    useEffect(() => {
        if (!serverMeteor) {
            getMeteor()
        }
    }, [])

    const getMeteor = async () => {
        try{
            setLoading(true)
            const response = await API.get(`https://api.nasa.gov/neo/rest/v1/neo/${router.query.id}?api_key=E9pMitzwMFuDNh4ElHuYpfoq8IMCBjsYEcsBsydh`)
            console.log("Meteor", response.data)
            setMeteorData(response.data)
        } catch (err) {
            console.log(err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(meteorData) {
            setInfoMeteor()
        }
    }, [meteorData])

    const setInfoMeteor = () => {
        const millisec = new Date().getTime()
        let difference = Infinity
        let curCloseApprData = meteorData!.close_approach_data[0]
        meteorData!.close_approach_data.forEach((el) => {
            const currentDifference = el.epoch_date_close_approach - millisec
            if(currentDifference > 0 && currentDifference < difference) {
                difference = currentDifference
                curCloseApprData = el
            }
        })
        setCloseApproachData(curCloseApprData)
        setToDestroy(Boolean(listDestroyMeteors.findIndex((m) => m.id === meteorData!.id) + 1))
    }

    const dispatch = useDispatch()

    const destroyMeteor = () => {
        if(toDestroy){
            dispatch(removeMeteorFromDestroy(router.query.id.toString()))
        } else {
            dispatch(addMeteorToDestroy(meteorData!))
        }
        setToDestroy(!toDestroy)
    }

  return (
    <MainLayout title={'Meteor Page'}>
        {(loading || !meteorData) ? <LoaderIcon width={"50px"} height={"50px"} /> :
            error ? <div style={{textAlign:'center', width: '100%'}}>
                        <Error>404</Error>
                        <Link href={'/'}><A>Вернуться к списку астероидов</A></Link>
                    </div> :
        <Container danger={Math.trunc(meteorData!.estimated_diameter.meters.estimated_diameter_min) > 1000}>
            <MainHeader>{meteorData!.name}</MainHeader>
            <Parametrs>
                <Parametr>
                    <ParametrText>Дата</ParametrText>
                    <ParametrSpace />
                    <ParametrData>{closeApproachData ? 
                        closeApproachData.close_approach_date_full.substring(9,11) + " " + 
                        dates[closeApproachData.close_approach_date_full.substring(5,8)] + " " +
                        closeApproachData.close_approach_date_full.substring(0,4): ''}</ParametrData>
                </Parametr>
                <Parametr>
                    <ParametrText>Расстояние</ParametrText>
                    <ParametrSpace />
                    <ParametrData>
                        {closeApproachData ? 
                            Math.trunc(Number(closeApproachData.miss_distance.kilometers)) + ' км' : ''}
                    </ParametrData>
                </Parametr>
                <Parametr>
                    <ParametrText>Размер</ParametrText>
                    <ParametrSpace />
                    <ParametrData>{Math.trunc(meteorData!.estimated_diameter.meters.estimated_diameter_min)} м</ParametrData>
                </Parametr>
            </Parametrs>
            <Text>Список всех сближений астеройда:</Text>
            {meteorData!.close_approach_data.map((convergence, index) => 
                <ConvergenceContainer key={index}>
                    <Parametrs>
                        <Parametr>
                            <ParametrText>Дата</ParametrText>
                            <ParametrSpace />
                            <ParametrData>{
                                convergence.close_approach_date_full.substring(9,11) + " " + 
                                dates[convergence.close_approach_date_full.substring(5,8)] + " " +
                                convergence.close_approach_date_full.substring(0,4)}</ParametrData>
                        </Parametr>
                        <Parametr>
                            <ParametrText>Расстояние</ParametrText>
                            <ParametrSpace />
                            <ParametrData>
                                    {Math.trunc(Number(convergence.miss_distance.kilometers)) + ' км'}
                            </ParametrData>
                        </Parametr>
                        <Parametr>
                            <ParametrText>Орбита</ParametrText>
                            <ParametrSpace />
                            <ParametrData>{convergence.orbiting_body}</ParametrData>
                        </Parametr>
                        <Parametr>
                            <ParametrText>Скорость</ParametrText>
                            <ParametrSpace />
                            <ParametrData>{Math.trunc(Number(convergence.relative_velocity.kilometers_per_hour))} км/ч</ParametrData>
                        </Parametr>
                    </Parametrs>
                </ConvergenceContainer>)}
            <Button onClick={() => destroyMeteor()}>
                {toDestroy ? "Не уничтожать" : "На уничтожение"}
            </Button>
        </Container>}
    </MainLayout>
  )
}

Meteor.getInitialProps = async ({query, req}: NextPageContext) => {
    if (!req) {
      return {meteor: null}
    }
  
    const response = await API.get(`https://api.nasa.gov/neo/rest/v1/neo/${query.id}?api_key=E9pMitzwMFuDNh4ElHuYpfoq8IMCBjsYEcsBsydh`)
    const meteor: IMeteor = response.data
    console.log(response.data)
  
    return {
      meteor
    }
  }


const Container = styled.div<{danger: boolean}>`
    position: relative;
    ${({danger}) => danger ? 
    'background: linear-gradient(90deg, #FFB199 0%, #FF0844 100%);' : 
    'background: linear-gradient(90deg, #CFF37D 0%, #7DE88C 100%);'}
    border: 1px solid #000000;
    border-radius: 10px;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px 16px;
    overflow: hidden;
    text-align: center;
    padding-bottom: 20px;
    @media (max-width: 650px) {
        
    }
`

const MainHeader = styled.h1`
    font-size: 36px;
    line-height: 48px;
    @media (max-width: 650px) {
        font-size: 24px;
    }
`

const Error = styled.h1`
    margin-top: 20px;
    font-size: 36px;
    line-height: 48px;
    @media (max-width: 650px) {
        font-size: 24px;
    }
`

const A = styled.a`
    font-size: 16px;
    font-weight: 'normal';
    line-height: 50px;
    cursor:pointer;
    &:hover {
        text-decoration: 'underline';
        color: #000000;
    }
`

const Parametrs = styled.div`
    margin-top:16px;
    max-width:400px;
    margin: 0 auto;
`

const Parametr = styled.div`
    display: flex;
    flex-direction:row;
    position: relative;
    padding: 0;
    margin-bottom:8px;
`

const ParametrText = styled.div`
    font-size: 20px;
    margin: 0;
    bottom: -9px;
    position:relative;
    padding-right:2px;
    flex-grow:0;
    z-index: 2;
    @media (max-width: 650px) {
        font-size: 14px;
    }
`

const ParametrSpace = styled.div`
    border-bottom: 1px dotted #C2C2C2;
    flex-grow:1;
`

const ParametrData = styled.div`
    font-size: 20px;
    margin: 0;
    position:relative;
    bottom: -9px;
    padding-left:2px;
    flex-grow:0;
    @media (max-width: 650px) {
        font-size: 14px;
    }
`

const Text = styled.p`
    margin-top: 20px;
    font-size: 20px;
    @media (max-width: 650px) {
        font-size: 14px;
    }
`

const ConvergenceContainer = styled.div`
    width: 500px;
    height: 160px;
    border: 1px solid #000000;
    border-radius: 10px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 0 20px;
    @media (max-width: 650px) {
        width: calc(100% - 50px);
        height: 130px;
    }
`