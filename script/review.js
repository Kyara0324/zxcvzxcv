//Html 아이디 가져오기
const reviewForm = document.getElementById("reviewForm");
const reviewDiv = document.getElementById("reviewDiv");
//리뷰 작성 input value 값
const Id = document.getElementById("username");
const password = document.getElementById("pw");
const comment = document.getElementById("comment");
const reviewBtn = document.getElementById("reviewBtn");

function toggleLike(index) {
  const comments = JSON.parse(localStorage.getItem("comments") || "[]");
  comments[index].liked = !comments[index].liked; // 좋아요 상태 변경
  localStorage.setItem("comments", JSON.stringify(comments)); //댓글 문자열로 변환하여 저장하기
  loadComments(); // 댓글 다시 불러와서 UI 업데이트
}

const URLSearch = new URLSearchParams(location.search);

function searchParam(key) {
  return URLSearch.get(key); //query string으로 담아놓고 영화id값을 get해서 가져오기
}

// 댓글 저장 함수
function saveComments() {
  console.log(password.value);
  const comments = JSON.parse(localStorage.getItem("comments") || "[]"); // 저장된 댓글을 배열로 파싱하거나, 없으면 새 배열 할당
  const newComment = {
    movieId: searchParam("id"),
    id: Id.value,
    reviewId: Math.random() * 100000,
    password: password.value,
    comment: comment.value,
    time: new Date().toISOString(), // 댓글 작성 시간 추가
  };
  comments.push(newComment); // 새 댓글 객체를 배열에 추가
  localStorage.setItem("comments", JSON.stringify(comments)); // 배열을 문자열로 변환하여 저장
}

// 댓글 불러오기 및 화면에 뿌리기 함수
function loadComments() {
  reviewDiv.innerHTML = ""; // 기존 댓글창 초기화
  const comments = JSON.parse(localStorage.getItem("comments") || "[]");
  const commentFilter = comments.filter((comment) => {
    return comment.movieId === searchParam("id");
  });
  commentFilter.forEach((comment, index) => {
    let liked = comment.liked || false;
    const reviewHtml = `
        <div class="commentBox">
          <div class="profileCircle"></div>
          <div class="profileBox">
          <div class="nickname">${comment.id}</div>
            <img class="heart_image" src=${
              liked ? "../img/heart_full.png" : "../img/heart.png"
            } onclick= "toggleLike(${index})" alt="#">
            <p>${comment.comment}</p>
             <div class="timeStamp">${new Date(
               comment.time
             ).toLocaleString()}</div> <!--댓글 시간 출력-->
            <div class="profileEdit">
              <div class="textBox">
              <button class="btn_design" onclick="editComment(${index})">수정</button> <!-- 수정 이벤트 -->
              <button class="btn_design" onclick="deleteComment(${index})">삭제</button> <!-- 삭제 이벤트 -->
              </div>
            </div>
          </div>
        </div>`;
    reviewDiv.innerHTML += reviewHtml; // 각 댓글을 reviewDiv에 추가
  });
}

// 댓글 작성 이벤트 리스너
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (comment.value === "") {
    alert("후기를 작성해주세요!");
    comment.focus();
    return;
  } else {
    saveComments(); // 댓글 저장
    loadComments(); // 저장한 댓글 불러와서 화면에 뿌리기
    reviewForm.reset(); // 폼 초기화
  }
});

window.onload = function () {
  loadComments(); // 페이지 로드 시 저장된 댓글을 불러와서 화면에 출력
};

//  댓글 삭제 구현
function deleteComment(index) {
  const comments = JSON.parse(localStorage.getItem("comments") || "[]");
  console.log(index);
  const commentDlt = comments.filter((comment, idx) => {
    return comment.movieId === searchParam("id");
  });

  const commentToDelete = commentDlt[index]; //index에 뭐가 오는지 주석으로 달기

  const inputPassword = prompt("비밀번호를 입력하세요.");
  if (inputPassword === null) {
    alert("취소되었습니다."); // 사용자가 취소 버튼을 누르면 메시지 출력
    return;
  }

  if (inputPassword === commentToDelete.password) {
    // commentDlt.splice(index, 1); // 해당 인덱스의 댓글 삭제   <----★★★ 얘 대신 filter
    const f = comments.filter((comment) => {
      return comment.comment !== commentToDelete.comment;
    });

    localStorage.setItem("comments", JSON.stringify(f)); // 로컬 스토리지에 저장
    loadComments(); // 업데이트된 댓글을 다시 로드
    alert("댓글이 삭제되었습니다.");
  } else {
    alert("비밀번호가 일치하지 않습니다.");
  }
}

// 수정 기능 구현
function editComment(index) {
  const comments = JSON.parse(localStorage.getItem("comments") || "[]");
  const commentToEdit = comments[index];

  const inputPassword = prompt("비밀번호를 입력하세요."); // 비밀번호 요청
  if (inputPassword === null) {
    // 사용자가 취소를 선택한 경우
    alert("취소되었습니다.");
    return;
  }
  console.log(inputPassword);
  console.log(commentToEdit.password);
  if (inputPassword !== commentToEdit.password) {
    // 비밀번호 불일치 시
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const newComment = prompt(
    "새로운 댓글 내용을 입력하세요.",
    commentToEdit.comment
  ); // 새 댓글 내용 요청
  if (newComment === null) {
    // 사용자가 취소를 선택한 경우
    alert("취소되었습니다.");
    return;
  }

  if (newComment.trim() === "") {
    // 공백 또는 빈 문자열 입력 시
    alert("수정할 내용을 입력해주세요.");
    return;
  }

  commentToEdit.comment = newComment.trim(); // 댓글 내용 업데이트
  localStorage.setItem("comments", JSON.stringify(comments)); // 로컬 스토리지에 저장
  loadComments(); // 업데이트된 댓글을 다시 로드
  alert("댓글이 수정되었습니다."); // 수정 완료 메시지
}
