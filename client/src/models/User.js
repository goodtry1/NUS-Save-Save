export class User {
    constructor(userId, email, firstName, lastName, joinDate, contactNo, twoFAAuth) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.joinDate = joinDate;
        this.contactNo = contactNo;
        this.twoFAAuth = twoFAAuth;
    }
}