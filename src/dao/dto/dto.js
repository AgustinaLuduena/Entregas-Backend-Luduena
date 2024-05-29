export default class CurrentUserDTO {
    constructor(user) {  
      this.currentUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email || '',
        role: user.role,
        cart_id: user.cart,
      };
    }
  }
  

  