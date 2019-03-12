import React from 'react';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import DeckSwipe from '../../components/DeckSwipe/DeckSwipe';
import styled, { ThemeProvider } from 'styled-components/native';

const theme = {
    margin: '5px',
    flex: '1'
}

const StyledSafeArea = styled.SafeAreaView`
    flex: 1;
`;

const StyledContainer = styled.View`
    flex: 1;
    flex-direction: column;
    flex-wrap: wrap;
    overflow: scroll;
`;

const StyledHeaderView = styled.View``;

const StyledViewDeck = styled.View`
    flex: 1;
    flex-direction: column;
`;


const gabinete = (props) => (
    <StyledSafeArea style={{ flex: 1 }}>
        <StyledContainer>
            <StyledHeaderView>
                <HeaderToolbar
                    open={props}
                    title="Gabinete" />
            </StyledHeaderView>
            <StatusBar color="#ff9933" />
            <StyledViewDeck>
                <ThemeProvider theme={theme}>
                    <DeckSwipe />
                </ThemeProvider>
            </StyledViewDeck>
        </StyledContainer>
    </StyledSafeArea>
);

export default gabinete;