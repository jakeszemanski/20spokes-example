class ContactController < ApplicationController
  respond_to :json
  def index

  end

  def create
    contact = Contact.new(contact_params)

    if contact.save
      render json: { errors: 'Problems creating a contact'}, status: 422
    else
      render json: { errors: 'Problems creating a contact'}, status: 422
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:id, :first_name, :last_name, :email, :message)
  end
end
