import React, { Component } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import bestBtn1 from '../img/bestBtn1.png';
import bestBtn2 from '../img/bestBtn.png';
import '../css/boardDetail.css';

class BoardDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
      question: [],
      answer:[],
      answerContent: "",
    };
  }
  handleTextareaChange = (event) => {
    this.setState({ answerContent: event.target.value });
  };

  handleSubmitAnswer = () => {
    const { id } = this.props.match.params;
    const token = localStorage.getItem("accessToken");

    axios
      .post(
        `http://localhost:8080/board/answer/create/${id}`,
        { content: this.state.answerContent },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        // 성공적으로 요청을 보낸 경우
        console.log(res.data);
        // 답변 작성 후, 답변 목록을 다시 불러오는 코드를 추가하세요.
        // this.loadAnswers();
        this.setState({ answerContent: "" }); // 답변 작성란 초기화
      })
      .catch((error) => {
        console.error(error);
      });
  };

  
  componentDidMount() {
    const { id } = this.props.match.params;
    const token = localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:8080/board/detail/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.content != null) {
          this.setState({ question: [res.data] }, () => {
            console.log("asdasds");
            console.log(this.state.question); 
          });
          this.setState({ answer: [res.data.answerList] }, () => {
            console.log(this.state.answer);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleClick = () => {
    this.setState({ isClicked: !this.state.isClicked }, () => {
      const confirmMessage = this.state.isClicked
        ? "추천을 하시겠습니까?"
        : "추천을 취소 하시겠습니까?";
      const result = window.confirm(confirmMessage);
      if (result) {
        // 확인 버튼을 눌렀을 때의 동작
        console.log("사용자가 확인을 눌렀습니다.");
      } else {
        // 취소 버튼을 눌렀을 때의 동작
        console.log("사용자가 취소를 눌렀습니다.");
        this.setState({ isClicked: !this.state.isClicked }); // 클릭 이전 이미지 상태로 변경
      }
    });
  };

  render() {

    return (
      <div>
        {/* 내용 */}
        {this.state.question.map((board) => (
          <table className="detailTable" key={board.id}>
            <tbody>
            <tr><td className='detailSubject' colSpan={3}>{board.subject}</td></tr>
            <tr><td colSpan={3}><hr className='hrLine'></hr></td></tr>
            <tr><td className='detailNickName'><span>{board.name.name}</span>
                 <span className='wall'>/</span>
                 <span className='detailCreateAt'>{new Date(board.createAt).toLocaleDateString()}</span> </td>
                 <td className='detailReadCount'>조회수</td>
                 <td className='detailBestCount'>추천수</td></tr>
             <tr><td colSpan={3}><hr className='hrLine2'></hr></td></tr>

              <tr><td className='detailContent' colSpan={3}>{board.content}</td></tr>
            </tbody>
            </table>
        ))}
              <div className='best'>
                <div>추천수</div><div><img src={this.state.isClicked ? bestBtn2 : bestBtn1} className='bestBtn' onClick={this.handleClick} /> </div>
              </div>
              <hr className='hrLine'></hr>
              {this.state.answer.map((ans) => (
  <div>
    <table className='replyBox'>
      {ans.map((reply) => (
        <tr key={reply.id}>
          <td className='replyNickName'></td>
          <td className='replyContent'>{reply.content}<span className='replyCreateAt'>{new Date(reply.createAt).toLocaleDateString()}</span></td>
          <td className='modifyBtn'>수정</td>
          <td className='deleteBtn'>삭제</td>
        </tr>
      ))}
    </table>
    <hr className='hrLine2'></hr>
  </div>
              ))}
        <textarea
          onChange={this.handleTextareaChange}
          value={this.state.answerContent}
        ></textarea>
        <button onClick={this.handleSubmitAnswer}>답변 달기</button>

            </div>
            )
            }
          }
            export default BoardDetail;