

function dateFormater(dateString){
    const dateObject = new Date(dateString);
    const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const formattedDate =dateObject.toLocaleString('en-india',options);
    return formattedDate;
}
export default dateFormater;