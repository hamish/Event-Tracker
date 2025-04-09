# Event-Tracker

Event Tracker is a program that enables the tracking and point scoring of a scout event. Multiple trackers are expected to enter data as participants pass through checkpoints and complete activities.

Trackers need to be online to obtain the initial detials of the event, but it is intended that they can enter their data while offline (if they are in a location without mobile coverage for example.) Data will synchronize once they come online again.

## Setup

An event administrator may setup a new event and specify what fields are needed. An example may be:

* Patrol Name (Text)
* Interaction Type (Select)
    * Enter Base
    * Leave Base
    * Score
    * Passing Through
* Interaction Time (Autofilled)
* Base Name (Text)
    * Base 1
    * Base 2
    * Base 3
    * Roving
* Score (number, range specified)
* Notes (Text, Multiline)
* Currnet Location (Autofilled)

A share code or URL will be created and to allow other users to access the data entry screen

For the first iteration, anyone with the sharing code will be able to access the 

## Data Entry 

Users with the share code will be presented with the Data Entry screen.

This will present the event fields in a manner that the user can enter values to create a new interaction

## View Screen

This presents all of the interactions in a table format, allowing filtering of any column by value

# Scoring Screen
 View a summary of all interactions based on the data in one field, with the 

 Eg:

 A row for each Patrol, with a column for each "Base Name, with the Score value of the interaction for the patrol and base with "Score" Interaction Type
 
 Display a sum of all scores for the patrol at the end of the row and allow the rows to be sorted by the score totals.
 If the patrol has multiple scores for a given base, the last score is taken to be correct.