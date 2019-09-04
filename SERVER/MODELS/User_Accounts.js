class Accounts{
    constructor(){
        this.AllAccounts=[];
    }
    createAccount(req){
        const single_acc={
            id: this.AllAccounts.length+1,
            firstName: (req.firstName).trim(),
            lastName: (req.lastName).trim(),
            email: ((req.email).trim()).replace(/\s/g,''),
            password: (req.password).trim(),
            address: (req.address).trim(),
            bio: (req.bio).trim(),
            occupation: (req.occupation).trim(),
            expertise: (req.expertise).trim(),
            isAdmin: false,
            isAmentor: false
        }
        this.AllAccounts.push(single_acc);
        return single_acc;
    }
}
const accounts= new Accounts();

//Add a dummy ADMIN user 
const dummy_admin_user = {
    id: accounts.AllAccounts.length+1,
    firstName: "BRIGITE",
    lastName: "MUTONI",
    email: "mutonibrigitte@gmail.com",
    password: "12345",
    address: "BELGIUM",
    bio: "JAVASCRIPT ENTHUSIAST",
    occupation: "STUDENT",
    expertise: "NODEJS",
    isAdmin: true,
    isAmentor: false
};
accounts.AllAccounts.push(dummy_admin_user);

//Add a dummy non admin MENTOR user
const dummy_mentor_user = {
    id: accounts.AllAccounts.length+1,
    firstName: "AUGUSTIN",
    lastName: "NTAMBARA",
    email: "augustinntambara@gmail.com",
    password: "12345",
    address: "FRANCE",
    bio: "PYTHON ENTHUSIAST",
    occupation: "PROFESSOR",
    expertise: "PYTHON",
    isAdmin: false,
    isAmentor: true
};
accounts.AllAccounts.push(dummy_mentor_user);

//Add a dummy non admin MENTOR user
const dummy_mentor_user2 = {
    id: accounts.AllAccounts.length+1,
    firstName: "FIDELE",
    lastName: "BIZIMANA",
    email: "fidelebizimana@gmail.com",
    password: "12345",
    address: "GISENYI",
    bio: "RUBY ENTHUSIAST",
    occupation: "STUDEN",
    expertise: "RUBY",
    isAdmin: false,
    isAmentor: true
};
accounts.AllAccounts.push(dummy_mentor_user2);

//Add a dummy non admin MENTOR user
const dummy_mentor_user3 = {
    id: accounts.AllAccounts.length+1,
    firstName: "PAUL",
    lastName: "NSABIMANA",
    email: "paulnsabimana@gmail.com",
    password: "12345",
    address: "ERWANDA",
    bio: "C++ ENTHUSIAST",
    occupation: "STUDENT",
    expertise: "C++",
    isAdmin: false,
    isAmentor: true
};
accounts.AllAccounts.push(dummy_mentor_user3);

//Add a dummy non admin non mentor user(MENTEE)
const dummy_mentee_user = {
    id: accounts.AllAccounts.length+1,
    firstName: "DOROTHE",
    lastName: "MBARUSHIMANA",
    email: "dorothembarushimana@gmail.com",
    password: "12345",
    address: "ITALY",
    bio: "C# ENTHUSIAST",
    occupation: "ASSISTANT PROF",
    expertise: "C#",
    isAdmin: false,
    isAmentor: false
};
accounts.AllAccounts.push(dummy_mentee_user);

export default accounts;