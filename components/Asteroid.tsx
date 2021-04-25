import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { AsteroidSVG } from "../styles/svgIcons/AsteroidSVG"
import { DinoSVG } from "../styles/svgIcons/DinoSVG"
import Button from "../components/common/Button"
import { dates } from "../constants"
import { ICloseApproachData, IMeteor } from "../interafces/commonInterfaces"
import { addMeteorToDestroy, removeMeteorFromDestroy } from "../store/actions/destroyActions"
import { RootState } from "../store/reducers/rootReducer"
import Link from "next/link"

const Container = styled.div<{danger: boolean}>`
    position: relative;
    ${({danger}) => danger ? 
    'background: linear-gradient(90deg, #FFB199 0%, #FF0844 100%);' : 
    'background: linear-gradient(90deg, #CFF37D 0%, #7DE88C 100%);'}
    border: 1px solid #000000;
    border-radius: 10px;
    width: 100%;
    height: 200px;
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0px 16px;
    z-index: 1;
    overflow: hidden;
    @media (max-width: 650px) {
        height: 391px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 0px;
    }
`

const Right = styled.div`
    text-align: center;
    width: 158px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media (max-width: 650px) {
        margin-top: 16px;
        height: auto;
    }
`

const Center = styled.div`
    padding-top: 24px;
    margin-right: 10%;
    width: 289px;
    text-align: left;
    @media (max-width: 650px) {
        width: 100%;
        margin-right: 0;
        padding: 0 16px;
        padding-top: 105px;
    }
`

const Text = styled.p`
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
`

const TextBold = styled.p`
    font-family: HelveticaBold;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
`

const Header = styled.h1`
    font-family: HelveticaBold;
    font-size: 24px;
    line-height: 32px;
    text-decoration: underline;
    cursor: pointer;
`

const Parametrs = styled.div`
    margin-top:16px;
`

const Parametr = styled.div`
    display: flex;
    flex-direction:row;
    position: relative;
    padding: 0;
    margin-bottom:8px;
`

const ParametrText = styled.div`
    margin: 0;
    bottom: -5px;
    position:relative;
    padding-right:2px;
    flex-grow:0;
    z-index: 2;
`

const ParametrSpace = styled.div`
    border-bottom: 1px dotted #C2C2C2;
    flex-grow:1;
`

const ParametrData = styled.div`
    margin: 0;
    position:relative;
    bottom: -5px;
    padding-left:2px;
    flex-grow:0;
`

const WhiteSpace = styled.div`
    width: 100%;
    height: 246px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    display: none;
    z-index: -1;
    background: #FFF;
    @media (max-width: 650px) {
        display: block;
    }
`
const Dino = styled.div`
    position: absolute;
    bottom: 0px;
    left: 16px;
    z-index: 3;
    @media (max-width: 650px) {
        transform: scale(-1,1);
        bottom: 246px;
        left: inherit;
        right: 16px;
    }
`
const Aster = styled.div`
    position: absolute;
    bottom: 100px;
    left: 150px;
    z-index: -1;
    @media (max-width: 650px) {
        transform: scale(-1,1);
        bottom: 300px;
        left: 55px;
    }
`

interface IAsteroid {
    id: string
    name: string
    diameter: number
    close_approach_data: ICloseApproachData[]
    distanceKm: boolean
    meteor: IMeteor
}

const Asteroid: React.FC<any> = ({id, name, diameter, close_approach_data, distanceKm, meteor}: IAsteroid) => {
    const listDestroyMeteors = useSelector((state: RootState) => state.destroy.list)

    const [currentCloseApproachData, setCurrentCloseApproachData] = useState<ICloseApproachData | null>(null)
    const [toDestroy, setToDestroy] = useState<boolean>(false)

    const dispatch = useDispatch()

    const destroyMeteor = () => {
        if(toDestroy){
            dispatch(removeMeteorFromDestroy(id))
        } else {
            dispatch(addMeteorToDestroy(meteor))
        }
        setToDestroy(!toDestroy)
    }

    useEffect(() => {
        const millisec = new Date().getTime()
        let difference = Infinity
        let curCloseApprData = close_approach_data[0]
        close_approach_data.forEach((el) => {
            const currentDifference = el.epoch_date_close_approach - millisec
            if(currentDifference > 0 && currentDifference < difference && el.orbiting_body === 'Earth') {
                difference = currentDifference
                curCloseApprData = el
            }
        })
        setCurrentCloseApproachData(curCloseApprData)
        setToDestroy(Boolean(listDestroyMeteors.findIndex((m) => m.id === meteor.id) + 1))
    },[])
    return (
        <Container danger={Math.trunc(diameter) > 1000}>
            <WhiteSpace />
            <Dino>
                <DinoSVG/>
            </Dino>
            <Aster>
                <AsteroidSVG factor={Math.trunc(diameter)/1000}/>
            </Aster>
            <Center>
                <Link href={`/meteor/${id}`}>
                    <Header>
                        {name.substring(name.indexOf('(') + 1, name.length - 1)}
                    </Header>
                </Link>
                <Parametrs>
                    <Parametr>
                        <ParametrText>Дата</ParametrText>
                        <ParametrSpace />
                        <ParametrData>{currentCloseApproachData ? 
                            currentCloseApproachData.close_approach_date_full.substring(9,11) + " " + 
                            dates[currentCloseApproachData.close_approach_date_full.substring(5,8)] + " " +
                            currentCloseApproachData.close_approach_date_full.substring(0,4): ''}</ParametrData>
                    </Parametr>
                    <Parametr>
                        <ParametrText>Расстояние</ParametrText>
                        <ParametrSpace />
                        <ParametrData>
                            {currentCloseApproachData ? 
                                distanceKm ? Math.trunc(Number(currentCloseApproachData.miss_distance.kilometers)) + ' км' :
                                Math.trunc(Number(currentCloseApproachData.miss_distance.lunar)) + ' лун' : ''}
                        </ParametrData>
                    </Parametr>
                    <Parametr>
                        <ParametrText>Размер</ParametrText>
                        <ParametrSpace />
                        <ParametrData>{Math.trunc(diameter)} м</ParametrData>
                    </Parametr>
                </Parametrs>
            </Center>
            <Right>
                <Text>
                    Оценка:
                </Text>
                {Math.trunc(diameter) > 1000 ?
                    <TextBold>опасен</TextBold> :
                    <TextBold>не опасен</TextBold>}
                <Button onClick={() => destroyMeteor()}>
                    {toDestroy ? "Не уничтожать" : "На уничтожение"}
                </Button>
            </Right>
        </Container>
    )
}

export default Asteroid