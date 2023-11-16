#!/bin/bash

IMAGE_NAME="paice0510/api-studio"
VERSION=$(node -pe "require('./package.json').version")
IMAGE_TAG="$IMAGE_NAME:$VERSION"

# Verifica se a imagem já existe no registro Docker
if docker pull $IMAGE_TAG; then
  echo "A imagem $IMAGE_TAG já existe. Não é necessário construir e fazer push novamente."
else
  npm run build

  # Constrói a imagem com a versão e faz push para o registro Docker
  docker build -t $IMAGE_TAG .
  docker push $IMAGE_TAG

  echo $IMAGE_TAG
fi
