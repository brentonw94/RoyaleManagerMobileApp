import React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, Image } from 'react-native';


import downArrow from '../images/downArrow.png';
import middleArrow from '../images/middleArrow.png';
import upArrow from '../images/upArrow.png';

export default class MemberList extends React.Component {

  constructor(props){
    super(props);


  }

  render() {

    return (

      <FlatList
          data={this.props.members}
          style={styles.memberList}
          extraData={this.props.index}
          renderItem={({item}) =>
          <TouchableOpacity style={styles.singleMember}
                onPress={() => { this.props.handlePress(item)}}
                >
            <Text style={styles.memberRank}>{item.clanRank}</Text>
            <Text style={styles.memberName}>{item.name}</Text>
            {this.props.sorting == "clanRank" ? <Image style={styles.positionArrows} source={item.clanRankDiff > 0 ? upArrow : item.clanRankDiff === 0 ? middleArrow : downArrow}></Image> : []}
            <Text style={styles.memberPosition}>{
              this.props.sorting === "expLvl"       ?
              item.expLevel              :
              this.props.sorting === "donationsDiff" ?
              item.donationsDiff          :
          //    sorting === "warWins"      ?
          //    item.warWins             :
          //    sorting === "warCards"     ?
          //      item.warCards            :
              this.props.sorting === "clanRank"     ?
              Math.abs(item.clanRankDiff) : ""
            }</Text>


          </TouchableOpacity>
        }
        />

    )


  }
}

  const styles = StyleSheet.create({
    memberList: {
      flex:1,
      width:"100%"

    },
    singleMember: {
      margin:5,
      width:"96%",
      height:30,
      backgroundColor:"white",
      padding:"1%",
      borderColor:"black",
      backgroundColor:"rgb(200,200,200)",
      borderWidth:1.5,
      borderRadius:3,
      position:"relative"

    },
    memberRank : {
      left:0,
      position:"absolute"
    },
    memberName : {
      left:"30%",
      position:"absolute"
    },
    memberPosition : {
      right:"5%",
      position:"absolute"
    },
    positionArrows : {
      right : "10%",
      top: -5,
      position: "absolute"
    },



})
