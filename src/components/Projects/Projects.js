import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import ivy from "../../Assets/Projects/ivy.png";
import portfolio from "../../Assets/Projects/portfolio.png";
import nft from "../../Assets/Projects/nft.png";
import door from "../../Assets/Projects/door.png";
import miner from "../../Assets/Projects/miner.png";
import shift from "../../Assets/Projects/shift.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={door}
              isBlog={false}
              title="Door Visualizer"
              description="Door visualizer is an augmented reality app for smartphones.
              People can see through their smartphone and camera new doors directly in their interior."
              demoLink="https://www.door-visualizer.com/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={shift}
              isBlog={false}
              title="ShiftERP"
              description="First Fully Integrated End to End ERP Solution for Co-Packers and Supply Chain Teams."
              demoLink="https://www.shifterp.com/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={nft}
              isBlog={false}
              title="Smeisty"
              description="Smeisty is a single platform that supports companies at every stage of their NFT journey–from strategy and launch to sustained management of their brands and customer communities."
              demoLink="https://smeisty.app/"              
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ivy}
              isBlog={false}
              title="Ivy"
              description="The Ivy platform offers an easy 1-stop solution to manage guest requests with easy-to-read guest statuses and survey responses – across text messages, WhatsApp, and more."
              demoLink="https://www.revinate.com/solutions/revinate-ivy/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={miner}
              isBlog={false}
              title="MindMiner"
              description="Using 'Open AI' for the creating solutions of a problem and mint as NFT."
              demoLink="https://dev.mindminer.ai/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={portfolio}
              isBlog={false}
              title="My Porfolio"
              description="Designed and Developed by me to express my personal portfolio."
              ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
              demoLink="https://verime.tech/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
