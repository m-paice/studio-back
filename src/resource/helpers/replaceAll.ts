export const handleReplaceAll = ({ mensagem, contato, dia, diaDaSemana, horario }) => {
  let temp = mensagem;

  if (temp.includes('{{contato}}')) temp = temp.replace('{{contato}}', contato);
  if (dia && temp.includes('{{dia}}')) temp = temp.replace('{{dia}}', dia);
  if (diaDaSemana && temp.includes('{{dia-da-semana}}')) temp = temp.replace('{{dia-da-semana}}', `(${diaDaSemana})`);
  if (horario && temp.includes('{{horario}}')) temp = temp.replace('{{horario}}', horario);

  return temp;
};
