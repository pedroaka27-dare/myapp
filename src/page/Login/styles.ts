import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex:1,
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffffff',
        
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
        justifyContent:'center',
        paddingLeft:20,

        
    },
    Title:{
        justifyContent:'center',
        alignItems:'center',
        fontSize:50,
        fontWeight:"900",
        fontStyle:'italic',
        textAlign:'center',
        marginTop:20,

    },

    Text:{
        textAlign:'left',
        paddingLeft:20,
        fontSize:24,


    },


    Link:{
        textDecorationLine:'underline',
        justifyContent:'center',
        alignItems:'center',
        fontWeight:'600',
        marginTop:10,
        paddingLeft:5,
        textAlign:'center',
        fontSize:16,

    },

    TopBox: {
        flex:1,
        marginTop:'10%',
        marginBottom:'10%',
        alignItems:'center',
        alignContent:'center',
        
    },

    MiddleBox:{
        marginTop:'60%',
        marginBottom:'5%',
        flex:0,
        paddingLeft:20,
        

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
        textAlign:'center',
        width:168,
        height:60,

    },
    ButtonText:{
        textAlign:'center',
        fontSize:26,
        fontWeight:'900',
        justifyContent:'center',
        alignItems:'center',

    },


});