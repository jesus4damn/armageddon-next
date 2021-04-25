import Link from 'next/link'
import {MainLayout} from '../components/MainLayout'
import styled from "styled-components"

export default function ErrorPage() {
  return (
    <MainLayout title={'404'}>
      <Container>
        <Error>Error 404</Error>
        <Text>Please <Link href={'/'}><a>go back</a></Link> to safety</Text>
      </Container>
    </MainLayout>
  )
}

const Error = styled.h1`
  text-align: center;
`

const Text = styled.p`
  margin-top:10px;
  text-align: center;
`

const Container = styled.div`
  margin-top: 20px;
`