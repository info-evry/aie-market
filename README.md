# Asso market API

### Etape 1 : Installation des dépendances

```bash
npm i
```

### Etape 2 : Télécharge puis lance le conteneur docker

⚠️⚠️Pour cette étape la, docker est obligatoire. ⚠️⚠️

```bash
docker-compose up -d
```

### Etape 3 : Configuration du fichier ".env"

Copier/Coller le fichier ".env.template" puis le rennommer en ".env"
Nous utilisons des variables d'environnement :

Normalement il devrait il avoir :

```bash
DATABASE_URL="postgresql://root:root@localhost:5432/my_database?schema=public"
STRIPE_SECRET=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_URL="http://localhost:3000/"
NEXT_PUBLIC_AUTH_URL="http://localhost:3002/"
NEXT_PUBLIC_NOTIFICATIONS_URL="http://localhost:3003/"
```

Pour ce qui est des secrets stripes, il vous faudra vos propres informations.
Voici quelques informations pour :
Une fois votre compte stripe créer vous aurez accès à la génération de vos clés.
Telecharger le client :
https://docs.stripe.com/stripe-cli?locale=fr-FR&install-method=apt

```bash
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg

echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list

sudo apt update

sudo apt install stripe

stripe login

stripe listen --forward-to http://localhost:3000/api/webhook/stripe
```

### Etape 4 : Création de votre Base de données avec prisma

```bash
npm run migrate
```

Un message disant que votre BDD et vos tables à été créer

### Etape 5 : Pour visualiser et agir sur votre BDD, prisma propose une interface graphique

```bash
npm run studio
```

Normalement, une page web devrait s'ouvrir avec le port http://localhost:5555
Elle permet de visualiser votre BDD

### Etape 6 : Lancer l'application

```bash
npm run start:dev
```

Une page web devrait s'ouvrir avec le port http://localhost:3000
