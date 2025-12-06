import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#FFFFFF',
        
        
    },
    Input: {
        borderColor:'#000000',
        borderWidth:2,
        borderRadius:50,
        backgroundColor:'#FFC100',
        width:'80%',
        marginVertical:10,
        marginRight:20,
        height:50,
        fontSize:20,
        paddingLeft:20,

        
    },
    Title:{
        fontSize:30,
        fontWeight:'semibold',
        textAlign:'center',
        fontFamily:'Inter',
        padding:10,


    },

    Text:{
        textAlign:'left',
        paddingLeft:20,
        fontSize:24,


    },


    Link:{
        textDecorationLine:'underline',
        fontWeight:'600',
        marginTop:10,
        paddingLeft:5,
        textAlign:'center',
        fontSize:16,

    },

    TopBox: {
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'10%',
        marginBottom:'15%',
        paddingTop:10,
        paddingHorizontal:20,
        backgroundColor:'#FCC100',
        width:'100%',
        height:'10%',
        
    },

    MiddleBox:{
        paddingLeft:15,
        backgroundColor:'#f9f9f9ff'
        

    },

    BottomBox:{
        flex:1,
        marginTop:'30%',
        marginBottom:'5%',
        alignItems:'center',
        alignContent:'center',
        justifyContent:'space-between',
    },

    InputBox:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },

    Button:{
        borderColor:'#000000',
        borderWidth:2,
        borderRadius:50,
        backgroundColor:'#FFC100',
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        width:168,
        height:60,

    },
    ButtonText:{
        textAlign:'center',
        fontSize:26,
        fontWeight:'900',

    },

    list:{
      marginStart:14,
      marginEnd:14,


    }


});