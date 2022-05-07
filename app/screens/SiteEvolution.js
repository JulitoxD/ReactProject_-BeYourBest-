import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { ListItem, Badge, Icon } from 'react-native-elements';

import TopBar from '../widgets/TopBar.js';
import { NavBar } from '../widgets/NavBar.js';

import firebase from '../utils/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1   
    },
    mainContainer: {
        flex: 8
    }
});

const SiteEvolution = ( props ) => {

    // ------------------------------ ATRIBUTES ----------------------------- //

    const { navigate }  = props.navigation;
    const navBarStyle   = 'ONE-COL-BTN';

    // -------------------------- STATES MANAGMENT -------------------------- //

    const [ challenges, setChallenges ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        getChallenges();
    }, []);

    const getChallenges = async () => {
        
        const querySnapshot = await getDocs(collection( firebase.db, "challenges" ));
        setChallenges(querySnapshot.docs);
        setLoading(false);

    }

    // ------------------------------- SCREEN ------------------------------- //
    return(
        <View style = { styles.screenContainer }>
            <TopBar
                topText     = 'EVOLUCIÓN'
                topButton   = { true }
                textBtn     = 'Home'
                onPress = { () => navigate('HomeScreen') }
            />
            
            {/* MAIN SCREEN */}
            <View style = { styles.mainContainer }>
                { loading ? 
                
                    <ActivityIndicator size="large" color="#9e9e9e" 
                    style={{alignItems: 'center', flex:1}}/>
            
                :

                    <ScrollView>
                        <FlatList 
                            data={ challenges } 
                            extraData={ challenges }
                            renderItem={ (item) => renderChallengesList( item, navigate ) } />
                    </ScrollView>

                }
            </View>
            {/* END MAIN SCREEN */}

            <NavBar 
                BtnTittle   = 'NUEVO RETO'
                navBarStyle = { navBarStyle }
                onPress     = {() => navigate('SiteNewChallenge')}
            />
            <NavBar 
                BtnTittle   = 'NUEVA CATEGORÍA'
                navBarStyle = { navBarStyle }
                onPress     = {() => navigate('SiteNewCategory')}
            />
        </View>
    )
    // ----------------------------- END SCREEN ----------------------------- //

}

// ------------------------------------------------------------------------------------ //
// ---------------------------------- OTHER FUNTIONS ---------------------------------- //
// ------------------------------------------------------------------------------------ //
const renderChallengesList = ( { item }, navigate ) => {

    const itemId = item.id;

    return (
        <>
        {/** LIST ITEM COMPONENT */}
        <ListItem key = {itemId} bottomDivider onPress={() => {
            navigate( 'SiteChallengeDetails', { challengeId: itemId } );}}>

            {/** ICON: CATEGORY */}
            <Icon name='work' type='material' color='#517fa4'/>
            {/** END ICON: CATEGORY */}

            {/** TICKET CONTENT */}
            <ListItem.Content>
                <ListItem.Title>{item.data().nombre}</ListItem.Title>
                <ListItem.Subtitle>{item.data().detalle}</ListItem.Subtitle>
                <ListItem.Subtitle>Total: {item.data().tiempo} horas || Necesitas: {item.data().periodicidad}h. diaria</ListItem.Subtitle>
            </ListItem.Content>
            {/** END TICKET CONTENT */}

            {/** BADGET: %PROGRESS */}
            <Badge
                value = {item.data().completado}
                badgeStyle = {{ backgroundColor: '#35606a', paddingTop: 15, 
                paddingBottom: 15, paddingStart: 8, paddingEnd: 8 }}  
                textStyle = {{ color: 'white' }}/>
            {/** END BADGET: %PROGRESS */}

            {/** ICON: NEXT */}
            <ListItem.Chevron color="gray" />
             {/** END ICON: NEXT */}

        </ListItem>
        {/** END LIST ITEM COMPONENT */}
        </>
    )

} //END RENDER_CHALLENGE_LIST

export default SiteEvolution;