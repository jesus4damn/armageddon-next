import Head from 'next/head'
import Link from 'next/link'
import styled from "styled-components"
import { useRouter } from 'next/router'

interface IProps {
  title?: string
}

export const MainLayout: React.FC<IProps> = ({ children, title = 'Next App' }) => {
  const location = useRouter()

  return (
    <>
      <Head>
        <title>{title} | Armageddon</title>
        <meta name="keywords" content="next,javascript,nextjs,react" />
        <meta name="description" content="test task for kvartirka company" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <header>
        <ContainerHeader>
              <Left>
                  <MainHeader>ARMAGEDDON V</MainHeader>
                  <TextHeader>Сервис мониторинга и уничтожения астероидов, опасно подлетающих к Земле.</TextHeader>
              </Left>
              <Right>
                <Link href={'/'}>
                  <A 
                      marginRight={24} 
                      active={location.pathname === '/' ||location.pathname === ''}>
                      Астероиды
                  </A>
                </Link>
                <Link href={'/destroy'}>
                  <A active={location.pathname === '/destroy'}
                      >
                      Уничтожение
                  </A>
                </Link>
              </Right>
        </ContainerHeader>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <ContainerFooter>
            <TextFooter>2021 © Все права и планета защищены</TextFooter>
        </ContainerFooter>
      </footer>
    </>
  )
}


const ContainerHeader = styled.div`
    width:100%;
    display:flex;
    justify-content:space-between;
    margin-top:37px;
    padding-bottom:24px;
    border-bottom: 1px solid #000;
    @media (max-width: 650px) {
        flex-direction: column;
        align-items: start;
        padding-bottom:18px;
    }
`

const Left = styled.div`
    width: 400px;
    @media (max-width: 650px) {
        width: 100%;
    }
`

const Right = styled.div`
    text-align: right;
    padding-top: 14px;
    @media (max-width: 650px) {
        padding-top: 19px;
    }
`

const MainHeader = styled.h1`
    font-size: 36px;
    line-height: 48px;
    @media (max-width: 650px) {
        font-size: 24px;
    }
`

const TextHeader = styled.p`
    font-size: 16px;
    line-height: 20px;
    margin-top: 8px;
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

const ContainerFooter = styled.div`
    width:100%;
    padding: 0 51px;
    padding-top: 40px;
    padding-bottom: 46px;
    text-align: center;
`;

const TextFooter = styled.div`
    font-size: 16px;
    line-height: 24px;
`;