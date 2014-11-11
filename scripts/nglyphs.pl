use strict;
use warnings;

my $nglyphs = {};

sub add_substring {
	my $substring = shift;
	my $freq = shift;
	my $len = length ($substring);
	$nglyphs->{$len}->{$substring} += $freq;
}

sub add_substrings {
	my $substring = shift;
	my $freq = shift;
	while (length($substring) > 1) {
		add_substring($substring, $freq);
		chop $substring;
	};
}

die ('Pipe a frequency table into this script') unless -p STDIN;

while (<STDIN>) {
	my $line = $_;
	chomp $line;
	next unless $line =~ /^(\d+)\s([a-z]+)/; # keep it simple
	my ($freq, $word) = ($1, $2);
	next if $word =~ /^!/; # then it is a comment
	next unless $word =~ /^[a-z]+$/; # for the time being, we keep it simple
	add_substrings($word, $freq);
}

use YAML;
print Dump $nglyphs;
