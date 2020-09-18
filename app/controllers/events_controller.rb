class EventsController < ApplicationController
  def create
    @p1=User.find_by(id: event_params[:p1ID])
    @p2=User.find_by(id: event_params[:p2ID])
    p1Initial = event_params[:p1InitialRating]
    @p1[:sports].each do |sport|
      if sport[:id] == event_params[:sport]
        p1Initial = sport[:rating]
      end
    end
    p2Initial = p1Initial
    @p2[:sports].each do |sport|
      if sport[:id] == event_params[:sport]
        p2Initial = sport[:rating]
      end
    end
    event = {
      p1ID: event_params[:p1ID],
      p1InitialRating: p1Initial,
      p2ID: event_params[:p2ID],
      p2InitialRating: p2Initial,
      winner: event_params[:winner],
      sport: event_params[:sport]
    }
    @event=Event.new(event)
    if @event.save
      render json: {
        status: :created,
        event: @event
      }
    else
      render json: {
        status: 500,
        errors: "failed to create event"
      }
    end
  end

  private
  def event_params
    params.require(:event).permit(:p1ID, :p1InitialRating, :p2ID, :p2InitialRating, :winner, :sport)
  end
end
