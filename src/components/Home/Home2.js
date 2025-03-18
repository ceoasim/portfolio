import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
            As a passionate AI engineer, I specialize in the integration of advanced AI models to build intelligent, scalable, and automated systems that transform user experiences and enhance business operations. My experience spans across Natural Language Processing (NLP), computer vision, predictive analytics, and intelligent search technologies, with a strong focus on leveraging state-of-the-art models such as OpenAI GPT, VideoGen, Gemini, and DeepSeek. 🤷‍♂️
              <br />
              <br />I am fluent in technologies like
              <i>
                <b className="purple"> React js, Nodejs, Next js, React Native, GraphQL, Redux, Angular, Vue, Spring boot, Web3. </b>
              </i>
              <i>
                <b className="purple">  Energetic and innovative senior software engineer with 6 years of experience in developing robust code for
high-volume businesses. An enthusiastic team player and deep creative thinker. Expert in advanced software
development methodologies, and tools, leading teams, designing and rollout of cutting-edge software solutions.
Integrated and leveraged advanced AI models such as OpenAI GPT, VideoGen, Gemini, and DeepSeek to enhance
applications with cutting-edge capabilities in natural language processing, video generation, and data analysis.
Spearheaded the integration of OpenAI's GPT models for conversational AI, enabling rich and responsive chatbot
experiences and automated content generation. Utilized VideoGen for AI-driven video creation, streamlining
multimedia workflows and enhancing user engagement. Worked with Gemini for advanced data processing and
pattern recognition, optimizing predictive analytics and recommendation systems. Integrated DeepSeek for
real-time data analysis and intelligent search functionalities, improving decision-making and business insights.
Successfully implemented API-based integrations, ensuring seamless communication between front-end interfaces
and backend AI models, while optimizing for performance and scalability. </b>
              </i>
              <br />
              <br />
              My field of Interest's are building new &nbsp;
              <i>
                <b className="purple">Web and Mobile Technologies and Products </b> and
                also in areas related to{" "}
                <b className="purple">
                  Blockchain.
                </b>
              </i>
              <br />
              <br />
              Whenever possible, I also apply my passion for developing products
              with <b className="purple">Node.js</b> and
              <i>
                <b className="purple">
                  {" "}
                  Modern Javascript Library and Frameworks
                </b>
              </i>
              &nbsp; like
              <i>
                <b className="purple"> React.js and Next.js</b>
              </i>
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/ceoasim"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://twitter.com/Muhamma03286770/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineTwitter />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/muhammad-a-a62a0710a/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
