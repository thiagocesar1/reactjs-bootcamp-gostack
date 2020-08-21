import React, {useState, useEffect} from "react";
import { IconButton, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Paper } from '@material-ui/core';
import { ThumbUp, Add, Remove, GitHub } from '@material-ui/icons';

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      console.log(response.data);
      setRepositories(response.data);
    });
  } , []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
        title: `Repositório ${Date.now()}`,
        url: "https://github.com/thiagocesar1/conceitos-reactjs-bootcamp-gostack",
        techs: ["ReactJS", "JavaScript"]});
    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`);
    let reposUpdated = [...repositories];
    const repoIndex = reposUpdated.findIndex(repository => repository.id === id);
    
    reposUpdated.splice(repoIndex, 1);    
    setRepositories(reposUpdated);
  }

  async function handleLikeRepository(id) {
    api.post(`repositories/${id}/like`);
    let reposUpdated = [...repositories];
    const repoIndex = reposUpdated.findIndex(repository => repository.id === id);
    let repository = repositories[repoIndex];
    repository.likes += 1;    
    setRepositories(reposUpdated);
  }

  return (
    <Container maxWidth="md">
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table" style={{backgroundColor:'#f8f8f2'}}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Github Link</TableCell>
                <TableCell align="center">Likes</TableCell>
                <TableCell align="center">Techs</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                repositories.map(repository => (
                    <TableRow>
                      <TableCell align="center">{repository.title}</TableCell>
                      <TableCell align="center">
                        <Button component={Link} variant="contained" color="primary" href={repository.url} target="_blank">
                          <GitHub/>
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        {repository.likes}
                        <IconButton variant="outlined" size="small" style={{marginLeft:5}} onClick={() => handleLikeRepository(repository.id)} color="primary">
                          <ThumbUp />
                        </IconButton>
                      </TableCell>
                      <TableCell align="justify">
                          <div component="ul">
                            {
                              repository.techs.map(tech => (
                                <Button variant="outlined" color="primary" size="small" style={{ margin:2 }}>
                                  {tech}
                                </Button>
                            ))}
                          </div>
                      </TableCell>
                      <TableCell align="center">
                        <Button onClick={() => handleRemoveRepository(repository.id)} variant="contained" color="secondary">
                          <Remove />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={handleAddRepository}>
                      <Add/> Adicionar
                    </Button>
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
    </Container>
  );
}

export default App;
