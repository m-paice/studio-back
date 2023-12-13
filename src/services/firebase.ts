import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'meu-petrecho',
    private_key_id: 'e9d3f94a13017461b0f44b6efc1cc7e6c588d8dd',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCoNecE6CjqGWe\n3d89o67xd2BFw0Y3/ZfJUM/pNtOajbo9f8pHHHt6b1RjzQ0hwc4KxS9Dbqc6ZBTw\nqIZwatRcn3BZux0kH+QzJYwZwJYrTfbt4koNCrd0zvANEoxWIIf6eGo/kDmsRg74\n9MeGtfFAZLAs9TNxCP//61Fl/N9dfzsUmXPEv0zZTVCaxbmXN/XGYMhXNRTkBKWU\nbRQUdttG3qzhMX2A026a3G+VSNiSH4LM64dJfz9a8yTi2zzTmHrvddwpzjhbL46m\nFQ9BCvOjWWqhLNbHXje9Gf4KPb6ylnFCNBIdN2CosRrHTqsSeXThgVCSse8M+0ai\nuw7itkgVAgMBAAECggEADwvVL007JXvOw13etMqzKxqx+CK1Cn4R3m/fauWgrTmY\ntMlsz1uN1jTGHuMKyVnMvntpAHsM9ZAoKES3A/jWSwTOcDltcs3+W8/iyVjgox9n\nYBOW6vQxo5ed6jzNWZkxOfVWLWzOcJmH7coqpKjrKjG+hvM701jBRb0g8VP/xp/9\nRdKxPglsJkkUfjGvxbBNI+FomqRH6YFAMoGMjvN68amWbsJUcOM+qx4ygcQmdwAw\n1lHfvH1eDKHJJBvwom3ckGFrTeBrzqnc4m9xpAUeYiHU1HOV/mBDClla1LD/cR4t\nDXV//imwHvtQEXO4R3OI4zWU/Kjyn3+bpXnsxwUIfwKBgQDyRJKgYXG2nzmT7KUo\ntx/egDkCMOiSyQDRzK0tngNGa4sdN1HFn3Tl/uqu+AetExH8CADPFt2uN5q7nma1\ndva+MacasxDHP6l71NIueKzkJ04mmCWlBAFeXQUEY2wLD2z+cCTUyEZzFe5rysiT\n1SpKbD8RvtHtkxKAARw71eBXhwKBgQDNqP7dQSnAyUMEZAtLm5mG6AtnQWm17stz\n/dPOFTvUQxv5wTrV25MN/BSiupP/tMgPBHH0bxudhHftRu1Nt03v3Q9fJY4wWgSr\nPsoP03hw48rYMbuOiNAofxyFIbyzWoWg0cdqnzVHLROGmedlX1LwNlPlINUaScUL\nmQbsq64SgwKBgCz+52y6LHCKqhr7PMGPIXAlyHDLvKZmhqxwo0lxq5IMr03B1IIr\n135QFi5hCqvuesygf+X2jT2qPibSiKjza2hvuGWRFHCtNkE1icPvzcyiMDWi1HsN\nf2OTSzdBb/Ot7cRj97M9bzg4votuokoysSQZbq1RD5RcWHdFvYSveHdJAoGAUjlQ\nvHEDGnrc+nJtOataNF+tv3idpQl1+kfvWKOQqgqysqYYucvx/VNdhLoH1eIXYjmq\nvcl2RwHhWNJUqg+xb0b4kFfZg2daGoUeEDnCG5BXVxx7Gj+EycwYQPn+Ec8NQgDd\nM7m3eV+CQPxjUVpNNJDj9eWsjbgUudBSvmjdTbUCgYEAsCll7hffIY9jzZ8XcoMR\nuRmOsv5BL+akOXfzUNiXsCYqWNR3UWCqGqHhKOwbmG2VgQUA0L6BAWsZbxfiRcJF\nyrAsnlZyUYI6gnm1zE2T6ByTodkYTUsmjeEJJ8iTotPIeorMv+UrxOGCe7917dgc\ndILFbpBJemTUgLBQ8y45+YQ=\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-c4fdu@meu-petrecho.iam.gserviceaccount.com',
    client_id: '111691407824039455986',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-c4fdu%40meu-petrecho.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  }),
  databaseURL: 'https://meu-petrecho.firebaseio.com',
});

export async function sendNotificationFirebase({ token }) {
  const message = {
    notification: {
      title: 'Título da Mensagem',
      body: 'Corpo da Mensagem',
    },
    token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Mensagem enviada com sucesso:', response);
    })
    .catch((error) => {
      console.error('Erro ao enviar mensagem:', error);
    });
}
