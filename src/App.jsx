import './App.css';
import { FormControl, InputGroup, Container, Button, CardHeader, CardBody, CardText } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  Row,
  Card,
} from "react-bootstrap";


let clientId ;
let clientSecret ;


function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  // Unlike our last two variables, albums are going to hold an array of information
  // so we'll initialize an empty array for now that will get populated once we apply the artistID.
  const [albums, setAlbums] = useState([]);


  // Fetch the access token from Spotify API using client credentials
  useEffect(() => {
  let authParams = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "grant_type=client_credentials&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret,
    };
  
    fetch("https://accounts.spotify.com/api/token", authParams)
    .then((result) => result.json())
    .then((data) => {
      setAccessToken(data.access_token);
    });
  }, []);

  useEffect(() => {
    if (!clientId || !clientSecret) return;

    const authParams = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then(res => res.json())
      .then(data => setAccessToken(data.access_token))
      .catch(err => console.error("Auth error:", err));
  }, [clientId, clientSecret]);


  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get Artist Albums
    await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums?include_groups=album&market=US&limit=50",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });

    // Log the search input and artist ID
    console.log("Search Input: " + searchInput);
    console.log("Artist ID: " + artistID);
  }

  
  

  return (
  <>
    <h1 style={{ textAlign: "center", color: "#1ed760ff", }}>Spotify Finder</h1>
    <Container style={{
        display: 'flex',
        alignedItems: 'center',
        justifyContent: 'center',
        margin: '2rem 0'
      }}>
      <InputGroup>
        <FormControl
          placeholder="ID"
          type="text"
          value={clientId}
          onChange={e => setClientId(e.target.value)}
          style={{
            width: "50px",
            height: "35px",
            borderWidth: "0px",
            borderStyle: "solid",
            borderRadius: "5px",
            marginRight: "10px",
            paddingLeft: "10px",
            color: "black",
          }}
        />
      </InputGroup>
      <InputGroup>
        <FormControl
          placeholder="Secret"
          type="password"
          value={clientSecret}
          onChange={e => setClientSecret(e.target.value)}
          style={{
            width: "50px",
            height: "35px",
            borderWidth: "0px",
            borderStyle: "solid",
            borderRadius: "5px",
            marginRight: "10px",
            paddingLeft: "10px",
            color: "black",
          }}
        />
      </InputGroup>
    </Container>
    <Container>
      <InputGroup>
        <FormControl
          placeholder="Search For Artist"
          type="input"
          aria-label="Search for an Artist"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
               search();
            }
          }}
          onChange={(event) => setSearchInput(event.target.value)}
          style={{
            width: "300px",
            height: "35px",
            borderWidth: "0px",
            borderStyle: "solid",
            borderRadius: "5px",
            marginRight: "10px",
            paddingLeft: "10px",
          }}
        />
        <Button onClick={search}>Search</Button>
      </InputGroup>
      
    </Container>
    <Container>
      <Row
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignContent: "center",
        }}
      >
        {
          albums.map((album) => {
            return (
              <Card
                key={album.id}
                style={{
                  backgroundColor: "white",
                  margin: "10px",
                  borderRadius: "5px",
                  marginBottom: "30px",
                }}>
                <Card.Img
                  width={200}
                  src={album.images[0].url}
                  style={{borderRadius: '4%',}}/>
                <Card.Body>
                  <Card.Title
                    style={{
                      whiteSpace: 'wrap',
                      fontWeight: 'bold',
                      maxWidth: '200px',
                      fontSize: '18px',
                      marginTop: '10px',
                      color: 'black',
                    }}>
                      {album.name}
                    </Card.Title>
                    <Card.Text style={{color: 'black'}}>
                      Release Date: <br/>{album.release_date}
                    </Card.Text>
                    <Button
                      href={album.external_urls.spotify} style={{
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        borderRadius: '5px',
                        padding: '10px',
                    }}>
                      Album Link
                    </Button>
                </Card.Body>
              </Card>
            );
          })
        }
      </Row>
    </Container>
  </>
  )
}

export default App
