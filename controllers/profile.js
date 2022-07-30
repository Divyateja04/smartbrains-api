const handleProfile = (db) => (req, res) => {
    const {id} = req.params;
    
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(400).json("User not found");
        }
    })
    .catch(err => {
        res.status(400).json("Some error occured");
    })
}

const handleProfileUpdate = (db) => (req, res) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;

    db('users')
    .where({ id: id })
    .update({ name: name })
    .then(resp => {
        if(resp){
            res.send("Success");
        }else{
            res.status(400).json("Unable to update");
        }
    })
    .catch(err => res.status(400).json("Error updating"));
}

module.exports = {
    handleProfile: handleProfile,
    handleProfileUpdate: handleProfileUpdate
}