// const LikeDislikeButton = () => {
//     const handleLikeButton = () => {
//         if (likeClicked === false) {
//             setLiked(liked + 1);
//             setLikeClicked(true);
//         } else if (likeClicked === true) {
//             setLiked(liked - 1);
//             setLikeClicked(false);
//         }
//     }

//     const handleDislikeButton = () => {
//         if (dislikeClicked === false) {
//             setDisliked(disliked + 1);
//             setDislikeClicked(true);
//         } else if (dislikeClicked === true) {
//             setDisliked(disliked - 1);
//             setDislikeClicked(false);
//         }
//     }
//     return (
//         <>
//             <div>
//                 <div className="flex">

//                     {/* like  */}
//                     <div className="" onClick={() => handleLikeButton()}>
//                         like
//                     </div>
//                     <span>{liked}</span>

//                     {/* dislike  */}
//                     <div className="" onClick={() => handleDislikeButton()} >
//                         dislike
//                     </div>
//                     <span>{disliked}</span>

//                 </div>
//                 <div className="flex">

//                     {/* like  */}
//                     <div className="" onClick={() => handleLikeButton()}>
//                         like
//                     </div>
//                     <span>{liked}</span>

//                     {/* dislike  */}
//                     <div className="" onClick={() => handleDislikeButton()} >
//                         dislike
//                     </div>
//                     <span>{disliked}</span>

//                 </div>

//             </div>

//         </>
//     )
// }

// export default LikeDislikeButton;