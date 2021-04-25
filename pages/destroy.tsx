import Link from 'next/link'
import {MainLayout} from '../components/MainLayout'
import styled from "styled-components"
import Button from "../components/common/Button"
import Asteroid from "../components/Asteroid"
import { RootState } from '../store/reducers/rootReducer'
import { useSelector } from 'react-redux'

const Container = styled.div`
    padding-top: 26px;
    text-align: center;
`

const Header = styled.h1`
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

export default function Destroy() {
  const meteors = useSelector((state: RootState) => state.destroy.list)
  
  return (
    <MainLayout title={'Destroy Page'}>
        <Container>
            <Header>Список на уничтожение</Header>
            {meteors.map((meteor) => <Asteroid 
                                        key={meteor.id}
                                        id={meteor.id}
                                        name={meteor.name}
                                        diameter={meteor.estimated_diameter.meters.estimated_diameter_min}
                                        close_approach_data={meteor.close_approach_data}
                                        distanceKm={true}
                                        meteor={meteor}
                                        destroy={true}/>)}
            {meteors.length === 0 && <Link href={'/'}><A>Добавить астероиды</A></Link>}
            <div style={{marginTop: '20px'}}/>
            <Button>Заказ бригады им. Брюса Уилиса</Button>
        </Container>
    </MainLayout>
  )
}