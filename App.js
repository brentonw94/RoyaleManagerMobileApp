import React from 'react';
import Fetch from 'react-native-fetch';
import ReactNativeComponentTree from 'react-native/Libraries/Renderer/shims/ReactNativeComponentTree';
import { Container, Header, Title, Button, Left, Right, Body, Icon, Footer, FooterTab, Content } from 'native-base';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, ScrollView, Image, LayoutAnimation } from 'react-native';
import Swiper from 'react-native-swiper';
import downArrow from './images/downArrow.png';
import middleArrow from './images/middleArrow.png';
import upArrow from './images/upArrow.png';

function countInArray(array, value){ var count = 0; for(var i = 0; i < array.length; i++){ if(array[i] === value){ count++; } } return count; }

export default class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
        modalVisible:false,
        sorting:"clanRank",
        buttons:{
          index:1,

          left:{
            active:false
          },
          center:{
            active:true
          },
          right:{
            active:false
          }
        }
    }


  }

  onFooterButtonPress(button, index){
    var buttonsObj = this.state.buttons,
        scroller;
    buttonsObj.left.active = button === "left" ? true : false;
    buttonsObj.center.active = button === "center" ? true : false;
    buttonsObj.right.active = button === "right" ? true : false;

    if(index == buttonsObj.index){
      scroller = 0;
    }else if(index == buttonsObj.index - 1){
      scroller = -1;
    }else if(index == buttonsObj.index + 1){
      scroller = 1;
    }else if(index == buttonsObj.index - 2){
      scroller = -2;
    }else if(index == buttonsObj.index + 2){
      scroller = 2;
    }
    buttonsObj.index = index;
    this.refs.swiper.scrollBy(scroller);
    this.setState({
      buttons:buttonsObj
    })
  }


  calculateMemberStats(members){

    for(var i = 0; i < members.length; i++){
      members[i].clanRankDiff = members[i].previousClanRank - members[i].clanRank;
      members[i].donationsDiff = (((members[i].donations - members[i].donationsReceived)/(members[i].donations)*100).toFixed(0))+"%";
    }


    this.setState({
      members:members
    })



  }



  render() {


    const {selectedMember, buttons, modalVisible, sorting} = this.state;


    return (

   <Container>
       <Header>
         <Left>

         </Left>
         <Body>
           <Title>Royale Clan Manager</Title>
         </Body>
         <Right />
       </Header>



       <View style={{"flex":1}} >
       <Swiper style={styles.wrapper}
               showsButtons={false}
               loop={false}
               ref='swiper'
               index={1}
               showsPagination={false}
               onIndexChanged={(index) => {
                 var buttonsObj = this.state.buttons;
                buttonsObj.left.active = index === 0 ? true : false;
                buttonsObj.center.active = index === 1 ? true : false;
                buttonsObj.right.active = index === 2 ? true : false;
                buttonsObj.index = index;
                this.setState({
                  buttons:buttonsObj
                })
               }}
               >
       <View style={styles.comparison}>
          <Text style={styles.text}>Clans Comparison</Text>
        </View>
        <View style={styles.overview}>
          <Text style={styles.text}>Overview</Text>
        </View>
        <View style={styles.members}>
        <View style={styles.memberButtonHeader}>
        <Button style={styles.sorterButton} onPress={() => {
            var mem = this.state.members.sort(function(a, b) { return a.clanRank - b.clanRank; });

            this.setState({
              members:mem,
              sorting:"clanRank",
              index: null,
            }, () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              this.setState({
                index:1
              })
            });

        }}>
          <Text>Rank</Text>
        </Button>
          <Button style={styles.sorterButton} onPress={() => {
              var mem = this.state.members.sort(function(a, b) { return b.expLevel - a.expLevel; });


              this.setState({
                members:mem,
                sorting:"expLvl",
                index: null,
              }, () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                this.setState({
                  index:1
                })
              });

          }}>
            <Text>Exp Lvl</Text>
          </Button>
          <Button style={styles.sorterButton} onPress={() => {
              var mem = this.state.members.sort(function(a, b) { return parseInt(b.donationsDiff.replace("%", "")) - parseInt(a.donationsDiff.replace("%","")); });

              console.log(mem);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              this.setState({
                members:mem,
                sorting:"donationsDiff",
                index: null,
              },() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                this.setState({
                  index:1
                })
              });

          }}>
            <Text>Donation %</Text>
          </Button>
          <Button style={styles.sorterButton}>
            <Text>War wins</Text>
          </Button>
          <Button style={styles.sorterButton}>
            <Text>War cards</Text>
          </Button>
        </View>
        <FlatList
            data={this.state.members}
            extraData={this.state.members}
            style={styles.memberList}
            extraData={this.state.index}
            renderItem={({item}) =>
            <TouchableOpacity style={styles.singleMember}
                  onPress={()=> {
                    this.setState({modalVisible:true, selectedMember:item})
                }}>
              <Text style={styles.memberRank}>{item.clanRank}</Text>
              <Text style={styles.memberName}>{item.name}</Text>
              {sorting == "clanRank" ? <Image style={styles.positionArrows} source={item.clanRankDiff > 0 ? upArrow : item.clanRankDiff === 0 ? middleArrow : downArrow}></Image> : []}
              <Text style={styles.memberPosition}>{
                sorting === "expLvl"       ?
                item.expLevel              :
                sorting === "donationsDiff" ?
                item.donationsDiff          :
            //    sorting === "warWins"      ?
            //    item.warWins             :
            //    sorting === "warCards"     ?
            //      item.warCards            :
                sorting === "clanRank"     ?
                Math.abs(item.clanRankDiff) : ""
              }</Text>


            </TouchableOpacity>
          }
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            style={styles.memberModal}
            >
            <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>

              <View style={styles.outerModal}>


              <View style={styles.memberTitle}>
                <Text style={styles.titleName}>{selectedMember != undefined ? selectedMember.name : "" }</Text>
                <Button style={styles.closeButton}
                        onPress={() => {this.setState({modalVisible:false})}}
                        >
                        <Text style={styles.buttonText}>X</Text>
                </Button>
              </View>

              <ScrollView style={styles.memberBody}>
                <Text>Clan role : {selectedMember != undefined ? selectedMember.role : ""}</Text>
                <Text>Experience Level : {selectedMember != undefined ? selectedMember.expLevel : ""}</Text>
                <Text>Donations Given : {selectedMember != undefined ? selectedMember.donations : ""}</Text>
                <Text>Donations Received : {selectedMember != undefined ? selectedMember.donationsReceived : ""}</Text>
              </ScrollView>



              </View>
            </View>
          </Modal>
        </View>

       </Swiper>
       </View>




       <Footer>
          <FooterTab>
            <Button
              active={buttons.left.active}
              onPress={() => {this.onFooterButtonPress("left",0)}}
            >
              <Text>Clans comparison</Text>
            </Button>
            <Button
              active={buttons.center.active}
              onPress={() => {this.onFooterButtonPress("center",1)}}
            >
              <Text>Overview</Text>
            </Button>
            <Button
              active={buttons.right.active}
              onPress={() => {this.onFooterButtonPress("right",2)}}
            >
              <Text>Members</Text>
            </Button>
          </FooterTab>
        </Footer>







       <Fetch
        url="https://api.clashroyale.com/v1/clans/%2320J2L0GL"
        headers={{
                 "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjRkNzIxZTZkLTFjMzYtNDEzMC1hYTMwLWE4NDE4MDkxMTNjZSIsImlhdCI6MTUzNDg1MDg3Mywic3ViIjoiZGV2ZWxvcGVyL2MwZDM1NzM5LWY4MTUtZGUxMy1hZDNlLWIyZWQ4NjE3NDZjNCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1OC43LjE0Ni4xNiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.CjXk9jrx8IT9lqjFp0k_UmcS_qMIfxRZ2iIP2pDdrem1yJw4dkWn1eOVyZ8NQpsTJ93FgQPpTY7UfLx81fIzFA",
                 "Accept": "application/json"
               }}
        retries={3}
        timeout={3000}
        onResponse={async (res) => {
          const json = await res.json()
          var members = json.memberList;
          this.calculateMemberStats(members);

            /*  for (var i = 0; i < members.length; i++){
                roles.push(members[i].role);
              }

              var counts = {
                leader : countInArray(roles, "leader"),
                coLeader : countInArray(roles, "coLeader"),
                elder : countInArray(roles, "elder"),
                member : countInArray(roles, "member")
              }

              var percentages = {
                leader : Number(counts.leader/(counts.leader+counts.coLeader+counts.elder+counts.member))*100,
                coLeader : Number(counts.coLeader/(counts.leader+counts.coLeader+counts.elder+counts.member))*100,
                elder : Number(counts.elder/(counts.leader+counts.coLeader+counts.elder+counts.member))*100,
                member : Number(counts.member/(counts.leader+counts.coLeader+counts.elder+counts.member))*100,
              }


            this.setState({
              leaderPerc:percentages.leader.toFixed(0)+"%",
              coLeaderPerc: percentages.coLeader.toFixed(0)+"%",
              elderPerc:percentages.elder.toFixed(0)+"%",
              memberPerc:percentages.member.toFixed(0)+"%"
            })*/

        }}
        onError={console.error}
      />
      <Fetch
       url="https://api.clashroyale.com/v1/clans/%2320J2L0GL/warlog"
       headers={{ "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjRkNzIxZTZkLTFjMzYtNDEzMC1hYTMwLWE4NDE4MDkxMTNjZSIsImlhdCI6MTUzNDg1MDg3Mywic3ViIjoiZGV2ZWxvcGVyL2MwZDM1NzM5LWY4MTUtZGUxMy1hZDNlLWIyZWQ4NjE3NDZjNCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1OC43LjE0Ni4xNiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.CjXk9jrx8IT9lqjFp0k_UmcS_qMIfxRZ2iIP2pDdrem1yJw4dkWn1eOVyZ8NQpsTJ93FgQPpTY7UfLx81fIzFA", "Accept": "application/json" }}
       retries={3}
       timeout={3000}
       onResponse={async (res) => { const json = await res.json(); var wars = json.items; this.setState({ warlog:wars })
       }}
       onError={console.error}
     />
     <Fetch
      url="https://api.clashroyale.com/v1/clans/%2320J2L0GL/currentwar"
      headers={{ "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjRkNzIxZTZkLTFjMzYtNDEzMC1hYTMwLWE4NDE4MDkxMTNjZSIsImlhdCI6MTUzNDg1MDg3Mywic3ViIjoiZGV2ZWxvcGVyL2MwZDM1NzM5LWY4MTUtZGUxMy1hZDNlLWIyZWQ4NjE3NDZjNCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1OC43LjE0Ni4xNiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.CjXk9jrx8IT9lqjFp0k_UmcS_qMIfxRZ2iIP2pDdrem1yJw4dkWn1eOVyZ8NQpsTJ93FgQPpTY7UfLx81fIzFA", "Accept": "application/json" }}
      retries={3}
      timeout={3000}
      onResponse={async (res) => { const json = await res.json(); var currentWar = json; this.setState({ currentWar:currentWar })
      }}
      onError={console.error}
    />

     </Container>


    );
  }
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    height:'100%'
  },
  comparison: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  overview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  members: {
    flex: 1,
    width:"100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
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
    borderWidth:3,
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
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  memberModal : {
    margin : "5%",
    backgroundColor : "blue"
  },
  outerModal : {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor : "#00BCD4",
  height: "80%" ,
  width: '96%',
  borderRadius:10,
  zIndex:3,
  borderWidth: 1,
  borderColor: '#fff'
},
closeButton : {
  position: "absolute",
  right : 10,
  top : 10,
  height : 30,
  width : 30,
  backgroundColor : "red",
  alignItems : "center",
  justifyContent : "center",
},
buttonText : {
  color : "white",
  fontSize : 20,
  fontWeight : "bold",
  lineHeight : 20

},
memberTitle : {
  position:"absolute",
  height:"10%",
  top:0,
  width:"100%",
  left:0,
  backgroundColor:"rgb(230,230,230)"
},
memberBody : {
  height:"90%",
  position:"absolute",
  top:"10%",
  width:"100%",
  left:0,
  zIndex:2,
  backgroundColor:"rgb(0,180,100)"
},
titleName : {
  position: "absolute",
  top: 10,
  left : 10,
  fontSize: 20,
  fontWeight : "bold",

},
positionArrows : {
  right : "10%",
  top: -5,
  position: "absolute"
},
memberButtonHeader :{
  flexDirection : "row",
  padding:"1%"
},
sorterButton : {
  height:30,
  width:"18%",
  position:"relative",
  margin:"1%"
}

});
