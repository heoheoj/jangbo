import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import { deleteThumb } from '../../util/APIUtils'
import '../../css/myPage.css';
import defaultimg  from '../../img/default-profile-img.png';

const path = './img'

class Mypage extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
      }

      handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: { Authorization: `Bearer ${accessToken}` }
        };    

        axios
        .post("http://localhost:8080/auth/thumbnail/update", formData, config)
        .then((response) => {
            alert("프로필 사진이 변경되었습니다.");
            window.location.href = "/mypage";
        }).catch((error) => {
            alert((error && error.message) || '프로필 사진 변경에 실패하였습니다. 관리자에게 문의하세요');
            window.location.href = "/mypage"; 
        })

      };

      deleteThumbnail(event) {
        deleteThumb()
        .then((response) => {
            alert("프로필 사진이 삭제되었습니다.");
            window.location.href = "/mypage";
        }).catch((error) => {
            alert((error && error.message) || '프로필 사진 삭제에 실패하였습니다. 관리자에게 문의하세요');
            window.location.href = "/mypage"; 
        })
      };

    render() {
        return (
            <div className="profile-container">
                <div className="container">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            { 
                                this.props.currentUser.information.imageUrl ? (
                                    <img className='profile-img' 
                                    src={path+this.props.currentUser.information.imageUrl}
                                    alt={this.props.currentUser.information.name}/>
                                ) : (
                                    <img className='profile-img' 
                                    src = {defaultimg}
                                    alt={this.props.currentUser.information.name}/>
                                )
                            }
                        </div>

                        <div className='img-form-box'>
                                <input
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    ref={this.fileInputRef}
                                    onChange={this.handleFileInputChange}
                                    style={{ display: "none" }}
                                    />
                                <button className='img-form-btn' onClick={() => this.fileInputRef.current.click()}>
                                프로필 사진 변경
                                </button>
                                <button label="이미지 제거" className='img-form-btn' onClick={this.deleteThumbnail}>프로필 사진 제거</button>
                        </div>
                        <div className="profile-name">
                           <h2>{this.props.currentUser.information.name}</h2>
                           <p className="profile-email">{this.props.currentUser.information.email}</p>
                        </div>
                        <button className='modify-btn'><Link to='/setting/profile'>회원정보 수정</Link></button>
                    </div>
                    <div className='profile-info-etc'>
                        <div className='etc-box'>
                            <div className='box-title'>내가 작성한 글</div>
                                <li>작성글 1</li>
                                <li>작성글 2</li>
                                <li>작성글 3</li>
                                <li>작성글 4</li>
                                <li>작성글 5</li>
                            <button className='more-btn'>더보기</button>
                        </div>
                        <div className='etc-box'>
                            <div className='box-title'>내가 작성한 댓글</div>
                                <li>작성 댓글 1</li>
                                <li>작성 댓글 2</li>
                                <li>작성 댓글 3</li>
                                <li>작성 댓글 4</li>
                                <li>작성 댓글 5</li>
                            <button className='more-btn'>더보기</button>
                        </div>
                        <div className='etc-box'>
                            <div className='box-title'>내가 즐겨찾는 물품</div>
                            <div className='fav-box'>
                                <span className='fav-site'>물품 1</span>
                                <span className='fav-site'>물품 2</span>
                                <span className='fav-site'>물품 3</span>
                                </div>
                        </div>
                        <div className='etc-box'>
                            <div className='box-title'>내가 즐겨찾는 품목</div>
                            <div className='fav-box'>
                                <span className='fav-item'>품목 1</span>
                                <span className='fav-item'>품목 2</span>
                                <span className='fav-item'>품목 3</span>
                                </div>
                        </div>
                    </div>
                </div>    
            </div>
        );
    }
}

export default Mypage