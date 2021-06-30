import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import deleteImg from "../assets/images/delete.svg";

import "../styles/room.scss";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

const notify = () => toast.error("You must be logged in.");

export function AdinRoom() {
  const history = useHistory();
  const { user } = useAuth();
  const params = useParams<RoomParams>();

  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      const questionRef = await database
        .ref(`rooms/${roomId}/questions/${questionId}`)
        .remove();
    }
  }

  return (
    <div className="page-room">
      <Toaster />;
      <header>
        <div className="content">
          <img
            src={logoImg}
            alt="Letmeask"
            onClick={() => {
              history.push(`/`);
            }}
          />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined={true}
              onClick={() => {
                handleEndRoom();
              }}
            >
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteQuestion(question.id);
                  }}
                >
                  <img src={deleteImg} alt="remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
