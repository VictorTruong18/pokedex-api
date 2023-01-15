# Node.js README

Victor TRUONG

This project is a CRUD API built in node.js for pokemon trainers. You can register your pokemons, modify them, delete them and exchange them with other trainers. Follow the setup and then you’ll have access to a swagger documentation to help you use the API. 

![Screen Shot 2023-01-02 at 23.06.30.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_23.06.30.png)

# Setup

All the dotenv variables have not been gitignored to facilate onboarding. But of course good practice would be to keep them away from the public.

![ash-pokemon.gif](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/ash-pokemon.gif)

# Production

- clone the repo
- install docker
- docker compose build
- docker compose up

You might see this message pop a lot it’s because the node server is trying to access to the database which is not started yet.

![Screen Shot 2023-01-02 at 15.11.30.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_15.11.30.png)

You know the app is fully launched when you see these messages :

![Screen Shot 2023-01-02 at 15.11.23.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_15.11.23.png)

Then you can go  [http://localhost/api-docs/#/](http://localhost/api-docs/#/) to access the swagger doc 

**Go to the end of the READ ME if you want some help to do the exchange routes there is a lot of steps**

# Local

- npm install
- Set up the database inside .env.local
    
    ```jsx
    NODE_ENV=local
    NODE_APP_PORT=8080
    DATABASE_USERNAME=root
    DATABASE_PASSWORD=root
    DATABASE_NAME=POKEDEX_VICTOR
    DATABASE_HOST=localhost
    ```
    
    Don’t forget to create the database with the appropriate name
    
- Launch the database
- to launch the app :
    
    ```jsx
    npm run start:local
    ```
    

# Script

- Lint
    
    ```jsx
    npm run lint
    ```
    
- Test
    
    ```jsx
    npm run test
    ```
    

# Help for the exchanges routes

• La proposition d’échange de la part d’un des dresseurs à un autre, qui comprend notamment
le ou les Pokémon à échanger ;

- Login as the admin
- Create three pokemons  POST /pokemon ( you can see them on  paginated GET /dresseur/pokemon )
    
    ![Screen Shot 2023-01-02 at 17.11.12.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_17.11.12.png)
    
- Create a dresseur ( just go to the post /register route )
- Log in as that user you just created ( login Sacha psw Pikachu )
- Create two pokemons with user
    
    ![Screen Shot 2023-01-02 at 17.13.19.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_17.13.19.png)
    

- Now you have to create an exchange  we’ll say that the USER wants to exchange his three pokemons against  the two of the ADMIN
- go to POST /exchange
- fill the body

```jsx
{
  "recipient": 1 
  "pokemonInitiator": [
    // ID of the pokemons you give
  ],
  "pokemonRecipient": [
    [
     // Of the pokemons you want
    ]
  ]
}
```

```jsx
{
  "recipient": 1,
  "pokemonInitiator": [4,5],
  "pokemonRecipient": [1,2,3]
}
```

- You should see this
    
    ![Screen Shot 2023-01-02 at 17.19.59.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_17.19.59.png)
    

- Now you can accept  the exchange as the ADMIN because he is the recepient
- Log back as the admin
- Accept the exchange
    
    ![Screen Shot 2023-01-02 at 17.22.36.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_17.22.36.png)
    
- Then you should see this and we can see that the owner has changed
    
    ![Screen Shot 2023-01-02 at 17.24.10.png](Node%20js%20README%208684480253304ac4ab14b3d76986e7c5/Screen_Shot_2023-01-02_at_17.24.10.png)